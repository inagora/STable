<template>
	<div class="st-toolbar st-pn">
		<div v-if="pageMode=='waterfall'" class="st-pn-waterfall">
			<x-button
				icon="st-iconfont st-icon-left"
				size="small"
				:disabled="!store.hasPrePage"
				:title="locale.previousPage"></x-button>
			<x-button
				icon="st-iconfont st-icon-right"
				size="small"
				:disabled="!store.hasNextPage"
				:title="locale.nextPage"></x-button>
		</div>
		<div v-else class="st-pn-normal"></div>
		<select v-model="pageSize" v-if="pagination.pageSizeOptions" class="st-pn-size">
			<option v-for="(size, idx) of pagination.pageSizeOptions" :value="size" :key="idx" v-text="size+' '+locale.pageSizeUnit">10 条/页</option>
		</select>
		<div class="st-toolbar-separator">&nbsp;</div>
		<x-button
			icon="st-iconfont st-icon-sync"
			size="small"
			:title="locale.refresh"></x-button>
		<div class="st-flex-padding"></div>
		<div class="st-pn-msg" v-text="msg"></div>
	</div>
</template>

<script>
import XButton from './com/Button.vue';
export default {
	inject: {
		store: 'store',
		pageMode: 'pageMode',
		pagination: {
			default: {}
		},
		params: 'params',
		locale: 'locale'
	},
	components: {XButton},
	data(){
		return {
			msg: 'dfsfds',
			pageSize: this.params.count
		}
	}
}
</script>

<style lang="scss">
.st-pn{
	padding-right: 10px;
	padding-bottom: 10px;
	align-items: center;

	.st-btn{
		border-color: transparent;
		margin-bottom: 0;
	}
	.st-toolbar-separator{
		margin-bottom: 0;
	}

	&-size{
		font-size: 12px;
		margin-right: 14px;
	}
}
</style>