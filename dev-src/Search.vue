<template>
	<div
		v-if="searchFilter"
		class="st-search"
		:class="{
			'st-search-label-invisible':!labelVisible
		}"
	>
		<x-form 
			:field-list="defaultVal"
			inline 
			@submit.prevent="submit">
			<x-button :native-type="'submit'">
				{{ locale.search }}
			</x-button>
			<x-button
				v-if="searchResetable"
				@click="reset"
			>
				{{ locale.reset }}
			</x-button>
		</x-form>
	</div>
</template>

<script>
import XButton from './com/Button.vue';
import XForm from './form/form.vue';
export default {
	components:{ XButton, XForm },
	inject: [
		'searchFilter',
		'searchResetable',
		'labelVisible',
		'listeners',
		'actionMethods',
		'params',
		'store',
		'ignoreEmptySearchParam',
		'locale'
	],
	data() {
		return {
			//老版本参数
			defaultVal: [
				{
					type: 'radio',
					label: '测试radio',
					name: 'type1',
					value: '喜剧',
				}, {
					type: 'checkbox',
					label: '测试checkbox',
					name: 'type_list',
					value: ['喜剧','悬疑'],
				}, {
					label: '姓名',
					name: 'uname',
					required: true
				}
			], 
			//新版本参数
			formConfigData: {
				getConfig: {
					url: '/ajaxFormList',
					read: 'GET',
					data: {}
				},
				fieldList: [],
			},
		};
	},
	mounted(){
		// if(this.searchFilter) {
		// 	this.store.searchParams = this.getParams();
		// }
	},
	methods: {
		search(){}
	}
};
</script>

<style>

</style>
