import {ajax} from '../util/ajax';
import {alert} from '../com/Dialog';
import Progressbar from '../com/Progressbar';
export default {
	inject: ['store', 'records', 'params', 'url', 'actionMethods',  'pageMode','pageIndex', 'parallelCount', 'dynamicParallelCount', 'downloadTimeout', 'downloadAllFromJustOnePage','groupBy','sublistAt'],
	data() {
		return {
			flymanVisible: false,
			recordList: [],
			clean: true	//"干净"状态下的表格，不会提示下一页没有数据之类的提示
		};
	},
	watch: {
		'store.page': function(){
			this.load();
		},
		'store.sortKey': function(){
			this.throttleLoad();
		},
		'store.sortDirection': function(){
			this.throttleLoad();
		},
		'store.loadAction': function(val, oldVal){
			if(val != oldVal){
				if(val == 'loadPrePage')
					this.load('pre');
				else if(val == 'loadNextPage')
					this.load('next');
			}
		},
		'store.checkboxVal'(){
			let checkedAll = this.recordList.every((item, idx)=>this.store.checkboxVal.includes(idx));
			this.store.chkAll = checkedAll;
		}
	},
	mounted(){
		this.store.$on('load', (options)=>{

			if(options && options.reset)
				this.reset();
			else
				this.load();
		});
		this.store.$on('selectall', val=>{
			if(val) {
				this.store.checkboxVal = this.recordList.map((item,idx)=>idx);
			} else {
				this.store.checkboxVal = [];
			}
		});
		this.store.getCurrentPage = ()=>{
			return this.recordList;
		};
		this.store.getAllPages = ()=>{
			if(this.pageMode=='waterfall')
				return this.getAllOnWaterfall();
			else
				return this.getAllOnNormal();
		};
		setTimeout(()=>{
			this.load();
		}, 0);
	},
	methods: {
		reset(){
			this.store.hasNextPage = true;
			this.store.hasPrePage = false;
			this.clean = true;
			if(this.store.page == 1){
				this.load();	//页号等于1时，强制刷新一次
			} else
				this.store.page = 1;
		},
		load(actionType){
			if(this.records){
				this.setRecords(this.records);
				return;
			}
			if(this.isPageLoading) return;
			this.isPageLoading = true;
			this.timer = setTimeout(()=>{
				this.flymanVisible = true;
			}, 500);
			let params = Object.assign({}, this.params, this.store.searchParams);
			if(this.store.sortKey) {
				params.sort_key = this.store.sortKey;
				params.sort_direction = this.store.sortDirection;
			}
			if(this.pageMode=='waterfall'){
				let id = '';
				let count = params.count;
				if(actionType=='cur'){
					if(this.lastRequestParams) {
						id = this.lastRequestParams[this.pageIndex];
						count = this.lastRequestParams.count;
					}
				} else if(actionType=='pre'){
					if(this.recordList && this.recordList.length>0) {
						id = this.recordList[0][this.pageIndex];
					}
					count = -count;
				} else {
					if(!this.clean && this.recordList && this.recordList.length>0) {
						id = this.recordList[this.recordList.length-1][this.pageIndex];
					}
				}
				params.count = count;
				params[this.pageIndex] = id;
			} else
				params.page = this.store.page;

			this.lastRequestParams = params;
			let ajaxOptions = {url:this.url, data: params, type:this.actionMethods.read};
			
			let ret = this.store.emit('beforedatarequest', ajaxOptions);
			if(ret && ret.url)
				ajaxOptions = ret;
			
			ajax(ajaxOptions).then(res=>{
				this.isPageLoading = false;
				res = res[0];
				if(this.timer){
					clearTimeout(this.timer);
					this.timer = null;
				}
				this.flymanVisible = false;
				
				let ret = this.store.emit('dataload', res);
				if(ret)
					res = ret;
				
				if(res.errno){
					alert(res.errmsg||res.msg,'提示', {type: 'error'});
				} else {
					if(this.pageMode=='waterfall'){
						if(!this.clean && (!res.data.list || res.data.list.length<=0)) {
							alert((params.count>0?'后面':'前面')+'已没有更多数据了','提示', {type: 'error'});
							if(params.count>0)
								this.store.hasNextPage = false;
							else
								this.store.hasPrePage = false;
						} else {
							this.clean = false;
							this.setRecords(res.data.list);
							if(res.data.list.length < Math.abs(params.count)) {
								if(params.count > 0)
									this.store.hasNextPage = false;
								else
									this.store.hasPrePage = false;
							}

							if(params.count<0)	//向上翻页的时候
								this.store.hasNextPage = true;
							else if(params[this.pageIndex])	//向下翻页，并且当前不是第一页
								this.store.hasPrePage = true;
						}
					}else{
						this.setRecords(res.data.list);
						this.store.pageCount = res.data.page_count||this.store.page;
					}
				}

				if(this.pageMode == 'waterfall')
					this.store.loadAction = '';
			});
		},
		throttleLoad(){
			if(this.throttleTimer) {
				clearTimeout(this.throttleTimer);
				this.throttleTimer = null;
			}
			this.throttleTimer = setTimeout(()=>{
				this.store.$emit('load', {reset: true});
			}, 50);
		},
		refresh(pno){
			if(typeof pno != 'undefined'){
				pno = parseInt(pno, 10);
				if(pno != this.store.page){
					this.store.page = pno;
				} else {
					this.load('cur');
				}
			} else {
				this.load('cur');
			}
		},
		setRecords(records) {
			records.forEach((r,idx)=>{
				//每一行的辅助数据
				r._st_aux = {
					//这一行有哪些列会开启跨行，跨多少行
					merges: {},
					//哪些列不需要渲染dom。有跨行时，可能不需要渲染td
					ignoreRenders: [],
					//这一行的行号是多少
					rownumber: idx+1,
					render: {},
					btnsVisible: {},
					option: {}
				};
			});
			if(this.groupBy && this.groupBy.length>0) {
				let recordGroup = [records];
				for(let dataIndex of this.groupBy) {
					for(let groupIdx=recordGroup.length-1;groupIdx>=0;groupIdx--){
						let group = recordGroup[groupIdx],
							sortRet = {},
							valueList = [];
						
						for(let rec of group) {
							let v = rec[dataIndex];
							if(typeof v == 'undefined')
								v = '';
							if(!sortRet[v]) {
								valueList.push(v);
								sortRet[v] = [rec];
							} else {
								sortRet[v].push(rec);
							}
						}
						let ret = [];
						for(let v of valueList) {
							sortRet[v][0]._st_aux.merges[dataIndex] = sortRet[v].length;
							for(let i=1,len=sortRet[v].length;i<len;i++){
								sortRet[v][i]._st_aux.ignoreRenders.push(dataIndex);
							}
							ret.push(sortRet[v]);
						}
						
						ret.unshift(1);
						ret.unshift(groupIdx);
						Array.prototype.splice.apply(recordGroup, ret);
					}
				}

				
				records = [];
				recordGroup.forEach(group=>{
					records = records.concat(group);
				});

				this.store.emit('refresh', records);
			} else {
				this.store.emit('refresh', records);
			}

			records.forEach((record, idx)=>{
				this.columns.forEach(col=>{
					if(col.type=='render' && col.render) {
						record._st_aux.render[col.dataIndex] = col.render(record, col, idx);
					} else if (col.type=='button') {
						let visibleList = record._st_aux.btnsVisible[col.dataIndex] = [];
						(col.buttons||[]).forEach(btn=>{
							let visible = true;
							if(btn.visible) {
								if(Array.isArray(btn.visible)) {
									visible = record[btn.visible[0]]==btn.visible[1];
								} else if(typeof btn.visible=='function') {
									visible = btn.visible(record);
								}
							}
							visibleList.push(visible);
						}); 
					} else if (col.type=='option') {
						let val = col.options[record[col.dataIndex]+''];
						if(typeof val=='undefined') {
							if(typeof col.defaultOption!='undefined') {
								val = col.defaultOption!='undefined';
							} else 
								val = '';
						}
						record._st_aux.option[col.dataIndex] = val;
					}
				});
			});
			
			this.recordList = records;
			this.store.$emit('selectall', false);
		},
		
		getAllOnNormal() {
			return new Promise((resolve)=>{
				let progressbar = Progressbar.create();
				progressbar.show();
				progressbar.update(0, '开始下载数据');
				let list = [];
				let jobList = [];
				let retryList = [];
				let pageCount = this.store.pageCount||1;
				if(this.downloadAllFromJustOnePage) {
					pageCount = 1;
				}
				let pnoIdx = 0;
				/**
				 * 为了防止批量下载拖库，把数据库下垮，根据下载速度，动态调整最大并行下载数。
				 * 设最近10个请求的平均时间为ALT(average load time)
				 * 如果ALT<=1s，最大并行数为oriParallelCount;
				 * 否则，dt = ALT-1s，最大并行数 oriParallelCount*( 1 - dt/10s )
				 * 最小并行数为1。
				 * 这样，随着平均请求时间增多，最大并行数减少，以达到控制请求数目的
				 */
				let parallelCount = this.parallelCount;
				let oriParallelCount = parallelCount;
				let dynamicParallelCount = this.dynamicParallelCount;
				let loadTime = [];
				let loadedCount = 0;
				let createJob = (pno)=>{
					let params = Object.assign({}, this.params, this.store.searchParams);
					if(this.store.sortKey) {
						params.sort_key = this.store.sortKey;
						params.sort_direction = this.store.sortDirection;
					}
					params.page = pno;
					if(this.downloadAllFromJustOnePage) {
						params.count = 'max';
					}
					let ajaxOptions = {url:this.url, data: params, type:this.actionMethods.read, timeout: this.downloadTimeout};
					
					let ret = this.store.emit('beforedatarequest', ajaxOptions);
					if(ret && ret.url)
						ajaxOptions = ret;
				
					let startTime = new Date();
					let job = ajax(ajaxOptions);
					job.then(res=>{
						loadTime.push(new Date() - startTime);
						res = res[0];
						list[params.page] = res.data&&res.data.list||[];
						if(res.data && res.data.page_count)
							pageCount = res.data.page_count;
						let jobIndex = jobList.indexOf(job);
						jobList.splice(jobIndex, 1);
						startJob();

						loadedCount++;
						let per = loadedCount*100/pageCount;
						if(per>0 && per<1)
							per = 1;
						else if(per>99 && per<100)
							per = 99;
						else
							per = Math.floor(per);
						progressbar.update(per/100, `已下载${loadedCount}页，共${pageCount}页`);
					}, function(){
						loadTime.push(new Date() - startTime);
						jobList.splice(jobList.indexOf(job), 1);
						//jobList.push(createJob(pno));
						retryList.push(pno);
						startJob();
					});
					return job;
				};
				let startJob = ()=>{
					//根据ALT计算最大并行数
					if(dynamicParallelCount){
						let lastLoadTime = loadTime.slice(-10);
						if(lastLoadTime.length<=0) {
							parallelCount = oriParallelCount;
						} else {
							let totalTime = 0;
							lastLoadTime.forEach(t=> totalTime+=t);
							let ALT = totalTime/lastLoadTime.length;
							let count = oriParallelCount*( 1 - (ALT-1000)/10000 );
							count = Math.round(count);
							if(count<1)
								parallelCount = count;
							else if(count>oriParallelCount)
								parallelCount = oriParallelCount;
							else
								parallelCount = count;
						}
					}

					console.log('parallelCount: '+parallelCount);


					if(jobList.length>=parallelCount)
						return;
					if(retryList.length>0) {
						let pno = retryList.shift();
						jobList.push(createJob(pno));
						startJob();
					}else if(pnoIdx < pageCount) {
						pnoIdx++;
						jobList.push(createJob(pnoIdx));
						startJob();
					}
					
					if(retryList.length<=0 && jobList.length<=0 && pnoIdx>=pageCount) {
						progressbar.destroy();
						let ret = [];
						for(let i=1;i<=pageCount;i++){
							if(!list[i])
								alert('页面 '+i+' 数据有问题');
							ret = ret.concat(list[i]);
						}
						ret.forEach((record, idx)=>{
							this.columns.forEach(col=>{
								if(col.type=='render' && col.render) {
									record['_'+col.dataIndex+'_render_val'] = col.render(record, col, idx);
								}
							});
						});
						resolve(ret);
						return;
					}
					
				};
				startJob();
			});
		},
		//因为瀑布流模式下，每一页的id依赖上一个页面，所以没办法并行请求，也不知道总共有多少页
		getAllOnWaterfall(){
			return new Promise((resolve, reject)=>{
				let progressbar = Progressbar.create('infinite');
				progressbar.show();
				progressbar.update(0, '数据下载中，请稍候...');
				let list = [];
				let loadedCount = 0;
				let pageIndex = this.pageIndex;
				let startJob = (id)=>{
					let params = Object.assign({}, this.params, this.store.searchParams);
					if(this.store.sortKey) {
						params.sort_key = this.store.sortKey;
						params.sort_direction = this.store.sortDirection;
					}
					params[pageIndex] = id;
					if(this.downloadAllFromJustOnePage) {
						params.count = 'max';
					}
					let ajaxOptions = {url:this.url, data: params, type:this.actionMethods.read, timeout: this.downloadTimeout};
					
					let ret = this.store.emit('beforedatarequest', ajaxOptions);
					if(ret && ret.url)
						ajaxOptions = ret;
					
					ajax(ajaxOptions).then(res=>{
						res = res[0];
						if(res.errno){
							alert(res.errmsg,'提示', {type: 'error'});
							reject(res);
						} else {
							if(!res.data.list || res.data.list.length<=0) {
								list.forEach((record, idx)=>{
									this.columns.forEach(col=>{
										if(col.type=='render' && col.render) {
											record['_'+col.dataIndex+'_render_val'] = col.render(record, col, idx);
										}
									});
								});
								resolve(list);
								progressbar.destroy();
							} else {
								list = list.concat(res.data.list);
								if(res.data.list.length < params.count || this.downloadAllFromJustOnePage) {
									list.forEach((record, idx)=>{
										this.columns.forEach(col=>{
											if(col.type=='render' && col.render) {
												record['_'+col.dataIndex+'_render_val'] = col.render(record, col, idx);
											}
										});
									});
									resolve(list);
									progressbar.destroy();
								} else {
									id = list[list.length-1][pageIndex];
									startJob(id);
									loadedCount++;
									progressbar.update(0, `已下载 ${loadedCount} 页数据，请继续等待...`);
								}
							}
						}
					}, ()=>{
						
						setTimeout(()=>{
							startJob(id);
						}, 500);
					});
				};
				startJob('');
			});
		},
		getSelectRows(){
			if(this.selectMode=='single') {
				if(typeof this.store.radioVal=='number') {
					let record = this.recordList[this.store.radioVal];
					if(record)
						return [record];
				}
			} else {
				return this.store.checkboxVal.map(idx=>this.recordList[idx]);
			}
			return [];
		}
	}
};