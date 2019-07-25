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
			@submit="search"
		>
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
					type: 'input',
					label: '姓名',
					name: 'uname',
					value: 'pjc',
					required: true
				},
				{
					type: 'select',
					label: '影片类型',
					name: 'selectname',
					options: [
						{value: 'xiju',label: '喜剧'},
						{value: 'xuanyi',label: '悬疑'}
					],
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
		search(data) {
			//data处理
			console.log(data);
		}
	}
};
</script>

<style>

</style>
