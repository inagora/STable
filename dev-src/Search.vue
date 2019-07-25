<template>
	<div
		v-if="searchFilter"
		class="st-search"
		:class="{
			'st-search-label-invisible':!labelVisible
		}"
	>
		<x-form 
			:field-list="searchFilter"
			inline
			:label-visible="labelVisible"
			@submit="search"
		>
			<x-button :native-type="'submit'" type="primary">
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
	methods: {
		search(data) {
			//data处理
			console.log(data);
		}
	}
};
</script>

<style lang="scss">
.st-search{
	border-bottom: 1px solid #d0d0d0;
}
</style>
