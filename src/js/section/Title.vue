<template>
	<div v-if="!hideTitle" class="st-title">
		<div class="st-title-text" v-text="title"></div>
		<div v-if="chart" @click="store.$emit('chartshow',$event)" class="st-title-tool st-title-">📊</div>
		<div @click="showConfig" title="配置" class="st-title-tool">⚙</div>
	</div>
</template>
<script>
	import Dialog from '../com/Dialog.js';

	export default {
		inject: {
			chart: {
				default: false
			},
			title: {
				default: ''
			},
			hideTitle: {
				default: false
			},
			store: 'store'
		},
		methods: {
			showConfig() {
				let stable = this;
				Dialog.create({
					title: '列配置',
					autoShow: true,
					bodyCls: 'abc',
					bodyStyle: {padding: 0},
					data: {
						stableConfig: {
							hideTitle: true,
							columns: [{
								text: '列名',
								dataIndex: 'text'
							},{
								width: 100,
								text: '锁定',
								dataIndex: 'locked',
								render(record, col, idx) {
									return `<input type="checkbox" data-locked value="${idx}" ${record.locked?'checked':''} />`;
								}
							},{
								width: 100,
								text: '显示',
								dataIndex: 'visible',
								render(record, col, idx) {
									return `<input type="checkbox" data-visible value="${idx}" ${record.visible?'checked':''} />`;
								}
							}],
							records: this.store.columns.map(col=>{
								return Object.assign({}, col);
							})
						}
					},
					html: '<x-stable :config="stableConfig"></x-stable>',
					buttons: [{
						text: '保存列配置',
						type: 'success',
						click(){
							let lockedChecks = this.$el.querySelectorAll('[data-locked]');
							let visibleChecks = this.$el.querySelectorAll('[data-visible]');
							let columns = stable.store.columns;
							lockedChecks.forEach((c, idx)=>{
								columns[idx].locked = c.checked;
							});
							visibleChecks.forEach((c,idx)=>{
								columns[idx].visible = c.checked;
							});
							this.close();
							stable.store.columns = Array.from(columns);
						}
					}, {
						text: '取消',
						click(){
							this.close();
						}
					}]
				});
			}
		}
	}
</script>
<style>
	.st-title{
		color: #191919;
		height: 40px;
		background-color: #f8f8f8;
		border-bottom: 1px solid #d0d0d0;

		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.st-title-text{
		font-size: 16px;
		padding-left: 10px;
		font-weight: 500;
		flex: 1;
	}
	.st-title-tool{
		margin-right: 10px;
		cursor: pointer;
	}
</style>