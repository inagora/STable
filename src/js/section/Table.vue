<template>
	<div class="st-table">
		<div class="st-table-doc">
			<div class="st-table-head-box">
				<table-head
					:width="width"
					:locked="false"
					:columns="columns"
					@st_dragstart="dragstart"
					@st_dragover="dragover"
					@st_drop="drop"
					@st_dragend="dragend"
					@st_dragleave="dragleave"></table-head>
			</div>
			<table-head
				:width="lockedWidth"
				:locked="true"
				:columns="columns"
				:checked-all.sync="checkedAll"
				@st_dragstart="dragstart"
				@st_dragover="dragover"
				@st_drop="drop"
				@st_dragend="dragend"
				@st_dragleave="dragleave"></table-head>
			<div class="st-table-body-box">
				<table-body :t-width="width" :columns="columns" :record-list="recordList" :locked="false" :hl-row-num="hlRowNum" :focus-row-num="focusRowNum" :have-fx="haveFx" :fx-result="fxResult" @hl="hl" @focus="focus"></table-body>
				<div v-if="recordList.length<=0" class="st-table-empty"></div>
			</div>
			<div v-show="haveLockedColumn" class="st-table-locked-body-box" :style="{width:lockedWidth+'px'}">
				<table-body
					:t-width="lockedWidth"
					:columns="columns"
					:record-list="recordList"
					:locked="true"
					:hl-row-num="hlRowNum"
					:focus-row-num="focusRowNum"
					:checked-all.sync="checkedAll"
					:have-fx="haveFx"
					:fx-result="fxResult"
					@hl="hl"
					@focus="focus"></table-body>
			</div>
			
			<div v-show="insertIndicator" class="insert-indicator" :style="{left: insertPosition+'px'}">
				<span class="fa fa-angle-down"></span>
				<span class="fa fa-angle-up"></span>
			</div>
		</div>
		<x-loader :visible="flymanVisible"></x-loader>
	</div>	
</template>
<script>
	import {ajax} from '../ajax';
	import Drag from './Table.drag.mixin';
	import Store from './Table.store.mixin';
	import XLoader from '../com/flyman.vue';
	import TableHead from './TableHead.vue';
	import TableBody from './TableBody.vue';
	import XForm from './Form.vue';

	let html = `
		<x-form id="st_edit_form" size="medium" label-position="right" :field-list="fields" :default-values="params" label-width="100px" :action-methods="actionMethods" @submit="edit">
		</x-form>`;
	
	export default {
		mixins: [Drag, Store],
		inject: {
			_key: '_key',
			url: {
				default: ''
			},
			deleteUrl: {
				default: ''
			},
			updateUrl: {
				default: ''
			},
			editConf: {
				default: []
			},
			idIndex: {
				default: ''
			},
			params: {
				default: {}
			},
			actionMethods: {
				default: {}
			},
			rowNumberVisible: {
				default: false
			}, 
			records: {
				default: false
			},
			store: {
				default: {}
			},
			selectMode: {
				default: 'none'
			},
			listeners: 'listeners'
		},
		data(){
			return {
				width: 0,
				lockedWidth: 0,
				hlRowNum: -1,
				focusRowNum: -1,
				static: !!this.records,
				columns: [],
				haveFx: false,
				fxResult: {},
				checkedAll: false,
				haveLockedColumn: false
			};
		},
		components: {TableHead, TableBody, XLoader},
		watch: {
			'store.columns': function() {
				this.formatColumns();
			}
		},

		mounted(){
			let headBox = this.$el.querySelector('.st-table-head-box');
			let bodyBox = this.$el.querySelector('.st-table-body-box');
			let lockedBodyBox = this.$el.querySelector('.st-table-locked-body-box');

			let self = this;
			self.left = 0;
			function syncScroll(){
				let left = bodyBox.scrollLeft;
				headBox.scrollLeft = left;
				
				if(self.haveLockedColumn){
					lockedBodyBox.scrollTop = bodyBox.scrollTop;

					if(left==0 && self.left!=0) {
						lockedBodyBox.classList.remove('st-table-locked-body-box-shadow');
					} else if(left!=0 && self.left==0) {
						lockedBodyBox.classList.add('st-table-locked-body-box-shadow');
					}
				}
				self.left = left;
			}
			bodyBox.addEventListener('scroll', syncScroll, false);
			lockedBodyBox.addEventListener('mousewheel', function(e){
				bodyBox.scrollTop += e.deltaY;
				if(e.deltaX != 0) {
					e.stopPropagation();
					e.preventDefault();
					bodyBox.scrollLeft += e.deltaX;
				}
			}, false);
			this.formatColumns();
			//this.load();

			let timer;
			window.addEventListener('resize', function(){
				if(timer){
					window.clearTimeout(timer);
					timer = null;
				}
				timer = window.setTimeout(function(){
					self.layout();
				}, 100);
			}, false);
		},
		methods:{
			formatColumns(){
				let columns = [],
					lockedColumns = [],
					freeColumns = [];
				this.store.columns.forEach((item, idx)=>{
					if(!item.visible) return;
					if(item.locked) {
						lockedColumns.push(item);
					} else {
						freeColumns.push(item);
					}
					item._width = 0;
				});
				columns = lockedColumns.concat(freeColumns);
				
				if(this.selectMode=='single') {
					columns.unshift({
						dataIndex:'_wd_aux_radio',
						text: '⚪',
						type: 'radio',
						width: 40,
						_width: 0,
						locked: true
					});
				} else if(this.selectMode=='multiple'){
					columns.unshift({
						dataIndex:'_wd_aux_checkbox',
						text: '☑',
						type: 'checkbox',
						width: 40,
						_width: 0,
						locked: true
					});
				}
				if(this.rowNumberVisible) {
					columns.unshift({
						dataIndex:'_wd_aux_rownumber',
						text: '#',
						type: 'rownumber',
						locked: true,
						_width: 0,
						width: 40,
					});
				}
				if(this.deleteUrl || this.updateUrl) {
					let cm = columns.filter(item=>item.dataIndex=='_wd_aux_op')[0];
					cm.buttons = this.getOpBtns();
				}

				for(let col of columns) {
					if(col.type=='button' && typeof col.width=='undefined'){
						col.width = 100*col.buttons.length;
					}
				}
				columns.push({
					dataIndex:'_wd_aux_pad',
					type: 'pad',
					width: 0,
					_width: 0,
					text: ' '
				});
				this.columns = columns;
				let haveFx = false;
				for(let column of this.columns) {
					if(column.fx) {
						haveFx = true;
						break;
					}
				}
				this.haveFx = haveFx;
				this.haveLockedColumn = columns[0].locked;
				
				this.layout();
			},
			getOpBtns(){
				let buttons = [];
				if(this.deleteUrl) {
					buttons.push({
						text: '删除',
						icon: 'el-icon-close',
						type: 'danger',
						click: (record)=>{
							this.$confirm('您确定要删除此行数据？', '提示', {
								type: 'error'
							}).then((res)=>{
								let id = record[this.idIndex];
								let data = {};
								data[this.idIndex] = id;
								Object.assign(data, this.params);
								ajax({url:this.deleteUrl, data, type: this.actionMethods.destroy}).then(res=>{
									res = res[0];
									if(res.errno==0) {
										this.$message({
											message: '删除成功',
											type: 'success'
										});
										this.load('cur');
									} else {
										this.$message.error('删除失败');
									}
								});
							}).catch(()=>{});
						}
					});
				}
				if(this.updateUrl) {
					buttons.push({
						text: '编辑',
						icon: 'el-icon-edit-outline',
						click:(record)=> {
							self = this;
							Dialog.create({
								title: '编辑',
								width: 600,
								height: '62%',
								html,
								buttons: [
									{
										text: '确认修改',
										nativeType: 'submit',
										form: 'st_edit_form',
										type: 'success'
									},{
										text: '取消',
										click(){
											this.close();
										}
									}
								],
								components:{
									XForm
								},
								data: {
									fields: this.editConf,
									params: record,
									actionMethods: this.actionMethods
								},
								autoShow: true,
								methods: {
									edit(data){
										let ret = true;
										if(self.listeners.beforeedit)
											ret = self.listeners.beforeedit.call(self.$root, data, record);
										if(ret===false)
											return;
										let updateUrl = self.updateUrl;
										if(ret) {
											if(ret.url)
												updateUrl = ret.url;
											if(ret.data)
												data = ret.data;
										}
										data[self.idIndex] = record[self.idIndex];
										
										ajax({ url: updateUrl, data, type: self.actionMethods.update}).then(res=>{
											res = res[0];
											if(res.errno==0){
												this.$message({
													message: '修改成功',
													type: 'success'
												});
												this.close();
												self.load('cur');
												
												if(self.listeners.afteredit)
													self.listeners.afteredit.call(self.$root, data);
											} else {
												this.$message({
													message: res.errmsg,
													type: 'error'
												});
											}
										});
									}
								}
							});
						}
					});
				}
				return buttons;
			},
			/**
			 * stable最复杂的一个逻辑。
			 * 基本规则：
			 * 1、列指定了width，已指定宽度为准
			 * 2、如果没有指定width和flex，默认 flex之为1
			 * 3、整体宽度boxWidth减去已明确指定了宽度width的列，剩下的列按flex指定的权重瓜分剩下的宽度；
			 * 4、对于通过flex获得宽度的列，最小宽度为 COLUMN_MIN_WIDTH
			 */
			layout(){
				if(!this.$el) return;
				const MIN_COLUMN_WIDTH = 100;
				let mainTable = this.$el.querySelector('.st-table-body-box');
				let stTable = this.$el;

				window.setTimeout(()=>{
					let boxWidth = mainTable.clientWidth;
					//第一遍为指定了width的列计算宽度
					let flexColumn = [],
						totalFlex = 0,
						countWidth = 0;
					this.columns.forEach((item, idx)=>{
						//最后一列是补白，先不算入宽度
						if(item.type=='pad')
							return;
						if(typeof item.width != 'undefined') {
							if(typeof item.width=='string' && /^([\d\.]+)%$/.test(item.width)) {
								item._width = Math.floor(boxWidth*parseFloat(RegExp.$1)/100);
								countWidth += item._width;
								return;
							}
							item._width = parseInt(item.width);
							countWidth += item._width;
						} else {
							totalFlex += item.flex;
							flexColumn.push(idx);
						}
					});
					
					if(flexColumn.length>0){
						let leftWidth = boxWidth - countWidth;
						for(let idx of flexColumn) {
							let w = this.columns[idx].flex*leftWidth/totalFlex;
							if( w < MIN_COLUMN_WIDTH){
								w = MIN_COLUMN_WIDTH;
							}
							if(typeof this.columns[idx].minWidth != 'undefined') {
								if(w < this.columns[idx].minWidth)
									w = this.columns[idx].minWidth;
							}
							if(typeof this.columns[idx].maxWidth != 'undefined') {
								if(w > this.columns[idx].maxWidth)
									w = this.columns[idx].maxWidth;
							}
							this.columns[idx]._width = Math.floor(w);
							countWidth += this.columns[idx]._width;
						}
					}


					if(countWidth<boxWidth){
						this.columns[this.columns.length-1]._width = boxWidth - countWidth;
						countWidth = boxWidth;
					} else {
						this.columns[this.columns.length-1]._width = 0;
					}
					let lockedWidth = 0;
					this.columns.forEach(item=>{
						if(item.locked)
							lockedWidth += item._width;
					});
					this.width = countWidth;
					this.lockedWidth = lockedWidth;

					this.$el.querySelector('.st-table-head-box').style.width = mainTable.clientWidth+'px';
					this.$el.querySelector('.st-table-body-box').style.width = mainTable.clientWidth+'px';
					this.$el.querySelector('.st-table-locked-body-box').style.height = 
						this.$el.querySelector('.st-table-body-box').clientHeight+'px';
				}, 0);
			},
			hl(idx){
				this.hlRowNum=idx;
			},
			focus(idx){
				this.focusRowNum=idx;
			}
		}
	}
</script>
