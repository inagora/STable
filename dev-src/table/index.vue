<template>
	<div
		class="st-table"
		:class="{
			'st-table-left-shadow': leftShadow,
			'st-table-right-shadow': rightShadow,
			'st-table-firefox': isFirefox
		}"
	>
		<div class="st-table-head-area">
			<x-head
				locked="left"
				:columns="leftColumns"
				:table-width="totalLeftWidth"
				@dragprepare="prepareDrag"
				@drag="drag"
				@drop="drop"
				@resizestart="startResize"
				@menushow="showMenu"
			/>
			<x-head
				:locked="false"
				:columns="freeColumns"
				:table-width="totalFreeWidth"
				@dragprepare="prepareDrag"
				@drag="drag"
				@drop="drop"
				@resizestart="startResize"
				@menushow="showMenu"
			/>
			<x-head
				locked="right"
				:columns="rightColumns"
				:table-width="totalRightWidth"
				@dragprepare="prepareDrag"
				@drag="drag"
				@drop="drop"
				@resizestart="startResize"
				@menushow="showMenu"
			/>
		</div>
		<div class="st-table-body-area">
			<div class="st-table-body-panel">
				<x-body
					locked="left"
					:columns="leftColumns"
					:record-list="recordList"
					:records-height="recordsHeight"
					:table-width="totalLeftWidth"
				/>
				<x-body
					:locked="false"
					:columns="freeColumns"
					:record-list="recordList"
					:records-height="recordsHeight"
					:table-width="totalFreeWidth"
				/>
				<x-body
					locked="right"
					:columns="rightColumns"
					:record-list="recordList"
					:records-height="recordsHeight"
					:table-width="totalRightWidth"
				/>
			</div>
		</div>

		<div v-show="fakeVisible" class="st-fake-scrollbar">
			<div
				v-if="leftColumns.length>0"
				class="st-fake-left"
			>
				<div
					class="st-fake-content"
					:style="{
						width: totalLeftWidth+'px'
					}"
				></div>
			</div>
			<div class="st-fake-free">
				<div
					class="st-fake-content"
					:style="{
						width: totalFreeWidth+'px'
					}"
				></div>
			</div>
			<div
				v-if="rightColumns.length>0"
				class="st-fake-right"
			>
				<div
					class="st-fake-content"
					:style="{
						width: totalRightWidth+'px'
					}"
				></div>
			</div>
		</div>
		<x-menu
			ref="menu"
			:columns="store.columns"
			@updatecolumn="formatColumns"
		/>

		<div
			v-if="resizing"
			class="st-table-resize st-table-resize-start"
			:style="{
				left: startResizePos+'px'
			}"
		></div>
		<div
			v-if="resizing"
			class="st-table-resize st-table-resize-end"
			:style="{
				left: endResizePos+'px'
			}"
		></div>

		<x-flyman :visible="flymanVisible" />
	</div>
</template>

<script>
import XHead from './Head.vue';
import XBody from './Body.vue';
import XMenu from './Menu';
import XFlyman from '../com/FlyMan.vue';
import {ajax} from '../util/ajax';
import {isFirefox} from '../util/util';
import data from './data.mixin.js';
import drag from './drag.mixin.js';
import resize from './resize.mixin.js';
import {create as createDia} from '../com/Dialog';
export default {
	components: {XHead, XBody, XMenu, XFlyman},
	mixins: [data, drag, resize],
	inject: ['store', 'rowNumberVisible', 'selectMode', 'layoutMode'],
	data() {
		return {
			hlRowNum: -1,
			focusRowNum: -1,
			leftShadow: false,
			rightShadow: false,
			leftColumns: [{text:'',_st_width:0}],
			freeColumns: [{text:'',_st_width:0}],
			rightColumns: [{text:'',_st_width:0}],
			recordsHeight: [],
			totalLeftWidth: 0,
			totalFreeWidth: 0,
			totalRightWidth: 0,
			fakeVisible: false,
			isFirefox
		};
	},
	watch: {
		'store.columns': function() {
			this.formatColumns();
		},
		recordList: function(){
			this.syncHeight();
		},
	},
	mounted(){
		this.columns = [];
		this.formatColumns();

		//监听滚动，以达到头、身体和fake滚动条一致
		let freeBox = this.$el.querySelector('.st-table-body-free');
		let fakeFreeBox = this.$el.querySelector('.st-fake-free');
		let freeHeadBox = this.$el.querySelector('.st-table-head-free');
		let self = this;
		var sync2scrollbar = function(){
			let scrollLeft = freeBox.scrollLeft,
				clientWidth = freeBox.clientWidth,
				scrollWidth = freeBox.scrollWidth;
			self.leftShadow = scrollLeft>0;
			self.rightShadow = (scrollLeft+clientWidth)<scrollWidth;
			
			if(scrollLeft != fakeFreeBox.scrollLeft) {
				fakeFreeBox.scrollLeft = scrollLeft;
			}
		};
		freeBox.addEventListener('scroll', sync2scrollbar, false);
		fakeFreeBox.addEventListener('scroll',()=>{
			let scrollLeft = fakeFreeBox.scrollLeft;
			if(scrollLeft != freeBox.scrollLeft) {
				freeBox.scrollLeft = scrollLeft;
			}
			freeHeadBox.scrollLeft = scrollLeft;
		}, false);

		if(this.isFirefox) {
			this.$el.querySelector('.st-table-body-panel').style.width = this.$el.querySelector('.st-table-body-area').clientWidth+'px';
		}
	},
	methods: {
		formatColumns(){
			let leftColumns = [],
				rightColumns = [],
				freeColumns = [];
			this.store.columns.forEach((item)=>{
				if(!item.visible) return;
				if(item.locked) {
					if(item.locked=='right')
						rightColumns.push(item);
					else
						leftColumns.push(item);
				} else {
					freeColumns.push(item);
				}
				item._st_width = 0;
			});
			
			if(this.selectMode=='single') {
				leftColumns.unshift({
					dataIndex:'_st_aux_radio',
					text: '⚪',
					type: 'radio',
					width: 40,
					locked: true
				});
			} else if(this.selectMode=='multiple'){
				leftColumns.unshift({
					dataIndex:'_st_aux_checkbox',
					text: '☑',
					type: 'checkbox',
					width: 40,
					locked: true
				});
			}
			if(this.rowNumberVisible) {
				leftColumns.unshift({
					dataIndex:'_st_aux_rownumber',
					text: '#',
					type: 'rownumber',
					locked: true,
					width: 40,
				});
			}
			if(this.deleteUrl || this.updateUrl) {
				rightColumns.push({
					dataIndex: '_st_aux_op',
					type: 'button',
					buttons: this.getOpBtns(),
					width: 0,
					text: '操作'
				});
			}

			freeColumns.push({
				dataIndex:'_st_aux_pad',
				type: 'pad',
				width: 0,
				text: ' '
			});
			
			this.leftColumns = leftColumns;
			this.freeColumns = freeColumns;
			this.rightColumns = rightColumns;

			this.columns = leftColumns.concat(freeColumns, rightColumns);

			for(let i=0;i<this.columns.length;i++){
				let col = this.columns[i];
				col._st_idx = i;

				if(col.type=='button'){
					(col.buttons||[]).forEach(btn=>{
						btn.size = btn.size||'small';
						if(!btn.type)
							btn.type = 'primary';
					});
					if(typeof col.width=='undefined')
						col.width = 100*col.buttons.length;
				}
			}
			
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
						}).then(()=>{
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
						let self = this;
						createDia({
							title: '编辑',
							width: 600,
							height: '62%',
							// html, //html未定义
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
				
				if(typeof item.width != 'undefined') {
					if(typeof item.width=='string' && /^([\d.]+)%$/.test(item.width)) {
						let w = Math.floor(boxWidth*parseFloat(RegExp.$1)/100);

						if( w < MIN_COLUMN_WIDTH){
							w = MIN_COLUMN_WIDTH;
						}
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
						item._st_width = w;
						countWidth += w;
						return;
					}
					item._st_width = parseInt(item.width);
					countWidth += item._st_width;
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
					columns[idx]._st_width = Math.floor(w);
					countWidth += columns[idx]._st_width;
				}
			}


			if(countWidth<boxWidth){
				this.freeColumns[this.freeColumns.length-1]._st_width = boxWidth - countWidth;
				countWidth = boxWidth;
			} else {
				this.freeColumns[this.freeColumns.length-1]._st_width = 0;
			}

			let totalLeftWidth = 0,
				totalFreeWidth = 0,
				totalRightWidth = 0;
			this.leftColumns.forEach(c=>totalLeftWidth+=c._st_width);
			this.freeColumns.forEach(c=>totalFreeWidth+=c._st_width);
			this.rightColumns.forEach(c=>totalRightWidth+=c._st_width);
		
			this.totalLeftWidth = totalLeftWidth;
			this.totalFreeWidth = totalFreeWidth;
			this.totalRightWidth = totalRightWidth;
		},
		syncHeight(){
			console.log('-- prepare syncHeight');
			if(this.syncTimer) {
				clearTimeout(this.syncHeight);
			}
			this.syncTimer = setTimeout(()=>{this._syncHeight();}, 50);
		},
		_syncHeight(){
			console.log('syncHeight');
			this.syncTimer = null;
			this.recordsHeight = this.recordList.map(()=>'auto');
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

					setTimeout(()=>{
						let freeEl = this.$el.querySelector('.st-table-body-free');
						this.fakeVisible = freeEl.scrollWidth>freeEl.clientWidth;
						if(this.fakeVisible) {
							this.$el.querySelector('.st-fake-scrollbar').style.width = this.$el.querySelector('.st-table-body-panel').clientWidth+'px';
						}
					}, 0);
				}
			}, 0);
		},
		showMenu(data){
			this.$refs.menu.show(data);
		}
	}
};
</script>

<style lang="scss">
.st-table{
	border-bottom: 1px solid #d0d0d0;
	position: relative;

	&-head-area{
		position: relative;
		border-bottom: 1px solid #d0d0d0;
		display: flex;
	}

	&-body-area{
		position: relative;
	}

	&-body-panel{
		display: flex;
	}
	&-firefox &-body-panel{
		position: absolute;
		left: 0;
		top: 0;
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
.st-fixed-stable{
	.st-table{
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.st-table-head-area{
		overflow-y: scroll;
	}
	.st-table-body-area{
		flex: 1;
		overflow-y: scroll;
	}
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

.st-fake-scrollbar{
	position: absolute;
	left: 0;
	bottom: 0;
	display: flex;
	z-index: 1;
}
.st-fake-left,
.st-fake-right{
	overflow-y: hidden;
	overflow-x: scroll;
}
.st-fake-left{
	border-right: 1px solid #e8eaec;
}
.st-fake-right{
	border-left: 1px solid #e8eaec;
}
.st-fake-free{
	flex: 1;
	overflow-y: hidden;
	overflow-x: scroll;
}
.st-fake-content{
	height: 1px;
	line-height: 0;
	font-size: 0;
	overflow: hidden;
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
