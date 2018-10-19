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
			_key: '_key',
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
					width: 500,
					autoShow: true,
					bodyStyle: {padding: 0},
					data: {
						stableConfig: {
							hideTitle: true,
							columns: [{
								text: '列名',
								dataIndex: 'text',
								cellWrap: true
							},{
								width: 60,
								text: '锁定',
								dataIndex: 'locked',
								render(record, col, idx) {
									return `<label class="st-title-cog-label"><input type="checkbox" data-locked value="${idx}" ${record.locked?'checked':''} /></label>`;
								}
							},{
								width: 60,
								text: '显示',
								dataIndex: 'visible',
								render(record, col, idx) {
									return `<label class="st-title-cog-label"><input type="checkbox" data-visible value="${idx}" ${record.visible?'checked':''} /></label>`;
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
							
							stable.store.saveColumnsState();
						}
					},{
						text: '清除列设置',
						type: 'danger',
						click(){
							if(confirm('您确定清除当前列设置，还原为默认状态？')) {
								stable.store.resetColumnsState();
							}
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
	.st-title-cog-label{
		display: block;
	}
</style>