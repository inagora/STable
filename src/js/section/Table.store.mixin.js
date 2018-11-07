import {ajax} from '../ajax';
import Progressbar from '../com/Progressbar';
export default {
	inject: ['pageMode','pageIndex', 'parallelCount', 'downloadTimeout'],
	data(){
		return {
			isPageLoading: false,
			flymanVisible: false,
			recordList: this.records||[],
			clean: true	//"干净"状态下的表格，不会提示下一页没有数据之类的提示
		};
	},
	watch: {
		recordList: function(){
			this.$nextTick(()=>{
				setTimeout(()=>{
					let freeRows = this.$el.querySelectorAll('.st-table-free-body .st-table-body-tr');
					let lockedRows = this.$el.querySelectorAll('.st-table-locked-body .st-table-body-tr');
					if(!freeRows || freeRows.length<=0)
						return;
					for(let i=0,len=freeRows.length;i<len;i++) {
						lockedRows[i].style.height = freeRows[i].offsetHeight+'px';
					}

					let bodyBox = this.$el.querySelector('.st-table-body-box');
					let lockedBodyBox = this.$el.querySelector('.st-table-locked-body-box');
					lockedBodyBox.style.height = bodyBox.clientHeight+'px';
					lockedBodyBox.scrollTop = bodyBox.scrollTop = 0;
				}, 0);
			});
		},
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
		}
	},
	mounted(){
		this.store.$on('load', (options)=>{

			if(options && options.reset)
				this.reset();
			else
				this.load();
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
			if(this.static){
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
			ajax({url:this.url, data: params, type:this.actionMethods.read}).then(res=>{
				this.isPageLoading = false;
				res = res[0];
				if(this.timer){
					clearTimeout(this.timer);
					this.timer = null;
				}
				this.flymanVisible = false;
				
				this.listeners.dataload && this.listeners.dataload(res);
				if(res.errno){
					this.$alert(res.errmsg||res.msg,'提示', {type: 'error'});
				} else {
					if(this.pageMode=='waterfall'){
						if(!this.clean && (!res.data.list || res.data.list.length<=0)) {
							this.$alert((params.count>0?'后面':'前面')+'已没有更多数据了','提示', {type: 'error'});
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
						this.store.page_count = res.data.page_count||this.store.page;
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
					this.load();
				}
			} else {
				this.load();
			}
		},
		setRecords(records) {
			this.store.$emit('refresh', records);
			records.forEach((record, idx)=>{
				this.columns.forEach(col=>{
					if(col.type=='render' && col.render) {
						record['_'+col.dataIndex+'_render_val'] = col.render(record, col, idx);
					} else if (col.type=='button') {
						record['_'+col.dataIndex+'_btns'] = [];
						(col.buttons||[]).forEach(btn=>{
							let visible = true;
							if(btn.visible) {
								if(Array.isArray(btn.visible)) {
									visible = record[btn.visible[0]]==btn.visible[1];
								} else if(typeof btn.visible=='function') {
									visible = btn.visible(record);
								}
							}
							record['_'+col.dataIndex+'_btns'].push(visible);
						}); 
					}
				});
			});
			if(this.haveFx) {
				let fxResult = {};
				this.columns.forEach(column=>{
					let di = column.dataIndex;
					if(column.fx == 'sum' || column.fx == 'average') {
						let total = 0;
						records.forEach(item=>{
							if(typeof item[di] != 'number')
								total += Number(item[di]);
							else
								total += item[di];
						});
						if(column.fx=='sum')
							fxResult[di] = '和：'+total;
						else if(records.length>0)
							fxResult[di] = '平均：'+total/records.length;
						else
							fxResult[di] = '平均：0';
					} else {
						fxResult[di] = '';
					}
				});
				this.fxResult = fxResult;
			}
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
				let page_count = this.store.page_count||1;
				let pnoIdx = 0;
				let parallelCount = this.parallelCount;
				let loadedCount = 0;
				let createJob = (pno)=>{
					let params = Object.assign({}, this.params, this.store.searchParams);
					if(this.store.sortKey) {
						params.sort_key = this.store.sortKey;
						params.sort_direction = this.store.sortDirection;
					}
					params.page = pno;
					
					let job = ajax({url:this.url, data: params, type:this.actionMethods.read, timeout: this.downloadTimeout});
					job.then(res=>{
						res = res[0];
						list[params.page] = res.data&&res.data.list||[];
						if(res.data && res.data.page_count)
							page_count = res.data.page_count;
						let jobIndex = jobList.indexOf(job);
						jobList.splice(jobIndex, 1);
						startJob();

						loadedCount++;
						let per = loadedCount*100/page_count;
						if(per>0 && per<1)
							per = 1;
						else if(per>99 && per<100)
							per = 99;
						else
							per = Math.floor(per);
						progressbar.update(per/100, `已下载${loadedCount}页，共${page_count}页`);
					}, function(){
						jobList.splice(jobList.indexOf(job), 1);
						jobList.push(createJob(pno));
					});
					return job;
				};
				let startJob = ()=>{
					if(jobList.length>=parallelCount)
						return;
					if(pnoIdx < page_count) {
						pnoIdx++;
						jobList.push(createJob(pnoIdx));
						startJob();
					}
					
					if(jobList.length<=0 && pnoIdx>=page_count) {
						progressbar.destroy();
						let ret = [];
						for(let i=1;i<=page_count;i++){
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
					ajax({url:this.url, data: params, type:this.actionMethods.read, timeout: this.downloadTimeout}).then(res=>{
						res = res[0];
						if(res.errno){
							this.$alert(res.errmsg,'提示', {type: 'error'});
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
								if(res.data.list.length < params.count) {
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
						//console.log(rej[1], rej[2]);
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
					if(record) return [record];
					else return [];
				}
			} else {
				return this.store.checkboxVal.map(idx=>this.recordList[idx]);
			}
		}
	}
};