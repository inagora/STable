<template>
	<div
		class="st-table"
		:class="{
			'st-table-left-shadow': leftShadow,
			'st-table-right-shadow': rightShadow
		}">
		<div class="st-table-head-area">
			<x-head
				locked="left"
				:columns="leftColumns"
				:table-width="totalLeftWidth"
				@dragprepare="prepareDrag"
				@drag="drag"
				@drop="drop"
				@resizestart="startResize"
				@menushow="showMenu"></x-head>
			<x-head
				:locked="false"
				:columns="freeColumns"
				:table-width="totalFreeWidth"
				@dragprepare="prepareDrag"
				@drag="drag"
				@drop="drop"
				@resizestart="startResize"
				@menushow="showMenu"></x-head>
			<x-head
				locked="right"
				:columns="rightColumns"
				:table-width="totalRightWidth"
				@dragprepare="prepareDrag"
				@drag="drag"
				@drop="drop"
				@resizestart="startResize"
				@menushow="showMenu"></x-head>
		</div>
		<div class="st-table-body-area">
			<x-body
				locked="left"
				:columns="leftColumns"
				:record-list="recordList"
				:records-height="recordsHeight"
				:table-width="totalLeftWidth"></x-body>
			<x-body
				:locked="false"
				:columns="freeColumns"
				:record-list="recordList"
				:records-height="recordsHeight"
				:table-width="totalFreeWidth"></x-body>
			<x-body
				locked="right"
				:columns="rightColumns"
				:record-list="recordList"
				:records-height="recordsHeight"
				:table-width="totalRightWidth"></x-body>
		</div>
		<x-menu v-if="menuVisible"></x-menu>

		<div
			v-if="resizing"
			class="st-table-resize st-table-resize-start"
			:style="{left: startResizePos+'px'}"></div>
		<div
			v-if="resizing"
			class="st-table-resize st-table-resize-end"
			:style="{left: endResizePos+'px'}"></div>
	</div>
</template>

<script>
import XHead from './Head.vue';
import XBody from './Body.vue';
import XMenu from './Menu';
import {ajax} from '../ajax';
import data from './data.js';
import drag from './drag.mixin.js';
import resize from './resize.mixin.js';
import menu from './menu.mixin.js';
import ResizeObserver from '../util/ResizeObserver';
export default {
	mixins: [data, drag, resize, menu],
	inject: ['store', 'rowNumberVisible', 'selectMode', 'layoutMode'],
	components: {XHead, XBody, XMenu},
	data() {
		return {
			hlRowNum: -1,
			focusRowNum: -1,
			leftShadow: false,
			rightShadow: false,
			leftColumns: [{text:'',_width:0}],
			freeColumns: [{text:'',_width:0}],
			rightColumns: [{text:'',_width:0}],
			recordsHeight: [],
			totalLeftWidth: 0,
			totalFreeWidth: 0,
			totalRightWidth: 0
		}
	},
	watch: {
		'store.columns': function() {
			this.formatColumns();
		},
		recordList: function(list){
			this.recordsHeight = list.map(()=>'auto');
			setTimeout(()=>{
				let leftTrs = this.$el.querySelectorAll('.st-table-body-left>table>tbody>tr');
				let freeTrs = this.$el.querySelectorAll('.st-table-body-free>table>tbody>tr');
				let rightTrs = this.$el.querySelectorAll('.st-table-body-right>table>tbody>tr');
				if(leftTrs.length>0 || rightTrs.length>0) {
					let hs = [];
					for(let i=0,len=freeTrs.length;i<len;i++) {
						let leftH = leftTrs[i]&&leftTrs[i].getBoundingClientRect().height||0;
						let rightH = rightTrs[i]&&rightTrs[i].getBoundingClientRect().height||0;
						let freeH = freeTrs[i] && freeTrs[i].getBoundingClientRect().height||0;
						let max = Math.max(leftH, freeH, rightH);
						hs.push(max+'px');
					}
					this.recordsHeight = hs;
				}

				this.$el.querySelector('.st-table-body-free').dispatchEvent(new Event('scroll'))
			}, 0);
		},
	},
	mounted(){
		this.columns = [];
		this.formatColumns();
		let freeBox = this.$el.querySelector('.st-table-body-free');
		if(this.layoutMode=='fixed'){
			let resizeObserver = new ResizeObserver(entries => {
				this.calcLayout();
			});
			resizeObserver.observe(this.$el.querySelector('.st-table-body-free'));
			resizeObserver.observe(this.$el.querySelector('.st-table-body-free .st-table-body'));
			this.resizeObserver = resizeObserver;

			let headBox = this.$el.querySelector('.st-table-head-free');
			let leftBox = this.$el.querySelector('.st-table-body-left');
			let rightBox = this.$el.querySelector('.st-table-body-right');
			function syncScroll(){
				let left = freeBox.scrollLeft;
				headBox.scrollLeft = left;
				
				leftBox.scrollTop = freeBox.scrollTop;
				rightBox.scrollTop = freeBox.scrollTop;
			}
			freeBox.addEventListener('scroll', syncScroll, false);
			function scroll(e){
				freeBox.scrollTop += e.deltaY;
				if(e.deltaX != 0) {
					e.stopPropagation();
					e.preventDefault();
					freeBox.scrollLeft += e.deltaX;
				}
			}
			this.$el.querySelector('.st-table-body-left').addEventListener('mousewheel', scroll, false);
			this.$el.querySelector('.st-table-body-right').addEventListener('mousewheel', scroll, false);
		}

		let self = this;
		function shadowDetect(){
			let scrollLeft = freeBox.scrollLeft,
				clientWidth = freeBox.clientWidth,
				scrollWidth = freeBox.scrollWidth;
			self.leftShadow = scrollLeft>0;
			self.rightShadow = (scrollLeft+clientWidth)<scrollWidth;
		}
		freeBox.addEventListener('scroll', shadowDetect, false);
	},
	beforeDestroy(){
		if(this.layoutMode=='fixed'){
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}
	},
	methods: {
		calcLayout(){
			let freeTable = this.$el.querySelector('.st-table-body-free');
			let leftTable = this.$el.querySelector('.st-table-body-left');
			let rightTable = this.$el.querySelector('.st-table-body-right');
			let bodyHeight = freeTable.clientHeight;
			leftTable.style.height = bodyHeight+'px';
			rightTable.style.height = bodyHeight+'px';
			rightTable.style.right = this.$el.querySelector('.st-table-body-area').clientWidth - freeTable.clientWidth + 'px';
		},
		formatColumns(){
			let columns,
				leftColumns = [],
				rightColumns = [],
				freeColumns = [];
			this.store.columns.forEach((item, idx)=>{
				if(!item.visible) return;
				if(item.locked) {
					if(item.locked=='right')
						rightColumns.push(item);
					else
						leftColumns.push(item);
				} else {
					freeColumns.push(item);
				}
				item._width = 0;
			});
			
			if(this.selectMode=='single') {
				leftColumns.unshift({
					dataIndex:'_st_aux_radio',
					text: '⚪',
					type: 'radio',
					width: 40,
					_width: 0,
					locked: true
				});
			} else if(this.selectMode=='multiple'){
				leftColumns.unshift({
					dataIndex:'_st_aux_checkbox',
					text: '☑',
					type: 'checkbox',
					width: 40,
					_width: 0,
					locked: true
				});
			}
			if(this.rowNumberVisible) {
				leftColumns.unshift({
					dataIndex:'_st_aux_rownumber',
					text: '#',
					type: 'rownumber',
					locked: true,
					_width: 0,
					width: 40,
				});
			}
			if(this.deleteUrl || this.updateUrl) {
				let cm = rightColumns.filter(item=>item.dataIndex=='_st_aux_op')[0];
				cm.buttons = this.getOpBtns();
			}

			freeColumns.push({
				dataIndex:'_st_aux_pad',
				type: 'pad',
				width: 0,
				_width: 0,
				text: ' '
			});
			

			freeColumns.unshift({
				dataIndex:'_st_aux_pad_left',
				text: '',
				_width: 0,
				type: 'pad'
			});
			freeColumns.push({
				dataIndex:'_st_aux_pad_right',
				text: '',
				_width: 0,
				type: 'pad'
			});
			this.leftColumns = leftColumns;
			this.freeColumns = freeColumns;
			this.rightColumns = rightColumns;

			this.columns = leftColumns.concat(freeColumns, rightColumns);

			let haveFx = false;
			for(let i=0;i<this.columns.length;i++){
				let col = this.columns[i];
				col._st_idx = i;

				if(col.type=='button' && typeof col.width=='undefined'){
					col.width = 100*col.buttons.length;
				}

				if(col.fx) {
					haveFx = true;
				}
			}
			this.haveFx = haveFx;
			
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
										ret = self.listeners.beforeedit.call(self.$parent, data, record);
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
												self.listeners.afteredit.call(self.$parent, data);
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
		 * 基本规则：
		 * 1、列指定了width，以指定宽度为准
		 * 2、如果没有指定width和flex，默认 flex之为1
		 * 3、整体宽度boxWidth减去已明确指定了宽度width的列，剩下的列按flex指定的权重瓜分剩下的宽度；
		 * 4、对于通过flex获得宽度的列，最小宽度为 COLUMN_MIN_WIDTH
		 */
		layout(){
			if(!this.$el) return;
			const MIN_COLUMN_WIDTH = 100;
			let boxRect = this.$el.getBoundingClientRect();
			let boxWidth = boxRect.width;

			//第一遍为指定了width的列计算宽度
			let flexColumn = [],
				totalFlex = 0,
				countWidth = 0,
				columns = this.columns;
			columns.forEach((item, idx)=>{
				//补白，先不算入宽度
				if(item.type=='pad')
					return;
				console.log(item.width)
				if(typeof item.width != 'undefined') {
					if(typeof item.width=='string' && /^([\d\.]+)%$/.test(item.width)) {
						let w = Math.floor(boxWidth*parseFloat(RegExp.$1)/100);
						/**
						 * @param {Number} column.minWidth 列的最小宽度
						 * @param {Number} column.maxWidth 列的最大宽度
						 */
						if(typeof item.minWidth != 'undefined' && w < item.minWidth) {
							w = item.minWidth;
						}
						if(typeof item.maxWidth != 'undefined' && w > item.maxWidth) {
							w = item.maxWidth;
						}
						item._width = w;
						countWidth += w;
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
				let restWidth = boxWidth - countWidth;
				for(let idx of flexColumn) {
					let w = columns[idx].flex*restWidth/totalFlex;
					if( w < MIN_COLUMN_WIDTH){
						w = MIN_COLUMN_WIDTH;
					}
					if(typeof columns[idx].minWidth != 'undefined') {
						if(w < columns[idx].minWidth)
							w = columns[idx].minWidth;
					}
					if(typeof columns[idx].maxWidth != 'undefined') {
						if(w > columns[idx].maxWidth)
							w = columns[idx].maxWidth;
					}
					columns[idx]._width = Math.floor(w);
					countWidth += columns[idx]._width;
				}
			}


			if(countWidth<boxWidth){
				this.freeColumns[this.freeColumns.length-2]._width = boxWidth - countWidth;
				countWidth = boxWidth;
			} else {
				this.freeColumns[this.freeColumns.length-2]._width = 0;
			}

			let totalLeftWidth = 0,
				totalFreeWidth = 0,
				totalRightWidth = 0;
			this.leftColumns.forEach(c=>totalLeftWidth+=c._width);
			this.freeColumns.forEach(c=>{
				if(c.type != 'pad')
					totalFreeWidth+=c._width
			});
			this.rightColumns.forEach(c=>totalRightWidth+=c._width);
			
			this.freeColumns[0]._width = totalLeftWidth;
			this.freeColumns[this.freeColumns.length-1]._width = totalRightWidth;
			totalFreeWidth = totalLeftWidth+totalFreeWidth+totalRightWidth;
		
			this.totalLeftWidth = totalLeftWidth;
			this.totalFreeWidth = totalFreeWidth;
			this.totalRightWidth = totalRightWidth;
		},
	}
}
</script>

<style lang="scss">
.st-table{
	border-bottom: 1px solid #d0d0d0;
	position: relative;

	&-head-area{
		position: relative;
		border-bottom: 1px solid #d0d0d0;
	}

	&-body-area{
		position: relative;
	}

	&-cell{
		padding: 7px 10px 6px;
		word-break: break-all;
		font-size: 14px;
	}
	&-cell-wrap{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&-resize{
		position: absolute;
		width: 1px;
		background: #949494;
		top: 0;
		bottom: 0;
		overflow: hidden;
		z-index: 100;
	}
}
.st-expand-stable{
	.st-table{
		&-head-area{
			overflow-x: hidden;
		}
		&-body-area{
			overflow-x: hidden;
		}
	}
}
.st-fixed-stable .st-table{
	flex: 1;
	display: flex;
	flex-direction: column;
}
.st-fixed-stable .st-table-head-area{
	overflow-y: scroll;
}
.st-fixed-stable .st-table-body-area{
	flex: 1;
	overflow: hidden;
}

.st-table-left-shadow .st-table-head-left{
	box-shadow: 5px 3px 6px -3px rgba(0,0,0,0.15);
}
.st-table-left-shadow .st-table-body-left{
	box-shadow: 5px -6px 6px -4px rgba(0,0,0,0.15);
}
.st-table-right-shadow .st-table-head-right{
	box-shadow: -5px 3px 6px -3px rgba(0,0,0,0.15);
}
.st-table-right-shadow .st-table-body-right{
	box-shadow: -5px -6px 6px -4px rgba(0,0,0,0.15);
}



.st-table-head-drag-fly{
	position: absolute;
	left: -1000px;
	top: -1000px;
	max-width: 200px;
	padding: 7px 10px 6px;
	margin-left: 10px;
	margin-top: 20px;
	background-image: linear-gradient(180deg, #fdfdfd, #f8f8f8);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	border: 1px solid #d0d0d0;
	color: #191919;
	font-size: 14px;
	z-index: 100;
}
@keyframes st_anim_pulse {
  from {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  50% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  to {
    transform: scale3d(0.9, 0.9, 0.9);
  }
}
.st-table-head-indicator{
	pointer-events: none;
	position: absolute;
	top: -1000px;
	left: -1000px;
	height: 64px;
	width: 10px;
	margin-left: -5px;
	margin-top: -14px;

	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	font-size: 10px;
	color: green;
	animation-name: st_anim_pulse;
	animation-duration: 1s;
	animation-fill-mode: both;
	animation-iteration-count: infinite;
	z-index: 99;
}
.st-table-head-indicator-bottom{
	transform: rotate(180deg);
}
</style>
