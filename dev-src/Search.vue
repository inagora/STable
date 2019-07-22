<template>
	<div
		v-if="searchFilter"
		class="st-search"
		:class="{
			'st-search-label-invisible':!labelVisible
		}"
	>
		<x-form
			ref="form"
			:inline="true"
			size="small"
			:field-list="searchFilter"
			:default-values="params"
			:action-methods="actionMethods" @submit="search"
		>
			<el-form-item>
				<el-button type="primary" icon="fa fa-search" native-type="submit">{{locale.search}}</el-button>
				<el-button v-if="searchResetable" @click="reset">{{locale.reset}}</el-button>
			</el-form-item>
		</x-form>
	</div>
</template>

<script>
import XForm from './Form.vue';
import XButton from './coms/Button.vue';
export default {
	components:{XForm, XButton},
	inject: {
		searchFilter: {
			default: false
		},
		searchResetable: 'searchResetable',
		labelVisible: 'labelVisible',
		listeners: 'listeners',
		actionMethods: 'actionMethods',
		params: 'params',
		store: 'store',
		ignoreEmptySearchParam: 'ignoreEmptySearchParam',
		locale: 'locale'
	},
	mounted(){
		if(this.searchFilter) {
			this.store.searchParams = this.getParams();
		}
	}
};
</script>

<style>

</style>
