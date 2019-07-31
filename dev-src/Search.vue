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
			:field-list="searchFilter"
			inline
			:label-visible="labelVisible"
		>
			<x-button 
				:native-type="'submit'" 
				type="primary"
			>
				{{ locale.search }}
			</x-button>
			<x-button
				v-if="searchResetable"
				@click.prevent="reset"
			>
				{{ locale.reset }}
			</x-button>
		</x-form>
	</div>
</template>

<script>
import XButton from './com/Button.vue';
import XForm from './form/form.vue';
// import {Console} from "./util/util.js";
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
	methods: {
		search() {
			//data处理
			// Console.log(data);
			this.$refs.form.submit();
		},
		reset() {
			this.$refs.form.resetFields('uname,age');
		}
	}
};
</script>

<style lang="scss">
.st-search{
	border-bottom: 1px solid #d0d0d0;
}
</style>
