<template>
	<div class="st-toolbar">
		<template v-for="(btn, btnIdx) of btns">
			<div v-if="btn=='|'" :key="btnIdx" class="st-toolbar-separator">
				&nbsp;
			</div>
			<div v-else-if="btn==' '" :key="btnIdx" class="st-toolbar-space"></div>
			<x-button v-else :key="btnIdx" v-bind="btn">
				{{ btn.text }}
			</x-button>
		</template>
	</div>
</template>

<script>
import XButton from './com/Button.vue';
export default {
	components: {XButton},
	inject: {
		toolbar: {
			default: []
		},
		addUrl:{
			default: false
		},
		addConf: {
			default: []
		},
		batDeleteUrl: {
			default: false
		},
		downloadable: {
			default: false
		},
		actionMethods: {
			default: {}
		}
	},
	data(){
		let tb = [];
		if(this.toolbar && Array.isArray(this.toolbar)) {
			tb = Array.from(this.toolbar);
		}
		if(this.addUrl || this.batDeleteUrl || this.downloadable) {
			if(tb.length>0)
				tb.unshift('|');
			if(this.downloadable=='all' || this.downloadable===true) {
				tb.unshift({
					type: 'primary',
					text: '下载所有页',
					icon: 'st-iconfont st-icon-download'
				});
			}
			if(this.downloadable=='single' || this.downloadable===true) {
				tb.unshift({
					type: 'primary',
					text: '下载当前页',
					icon: 'st-iconfont st-icon-download'
				});
			}
			if(this.batDeleteUrl){
				tb.unshift({
					type: 'danger',
					text: '批量删除',
					icon: 'st-iconfont st-icon-delete'
				});
			}
			if(this.addUrl) {
				tb.unshift({
					type: 'success',
					text: '添加',
					icon: 'st-iconfont st-icon-plus'
				});
			}
		}
		return {
			btns: tb
		};
	}
};
</script>

<style lang="scss">
.st-toolbar{
	border-bottom: 1px solid #d0d0d0;
	padding: 10px 0 0 10px;
	display: flex;
	flex-wrap: wrap;
	align-items: center;

	&-separator{
		display: inline-block;
		width: 1px;
		overflow: hidden;
		margin-right: 8px;
		margin-bottom: 10px;
		background-color: #d0d0d0;
	}

	.st-btn{
		margin-right: 8px;
		margin-bottom: 10px;
	}

}
</style>
