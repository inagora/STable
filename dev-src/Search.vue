<template>
	<div
		v-if="searchFilter"
		class="st-search"
		:class="{
			'st-search-label-invisible':!labelVisible
		}"
	>
		<form @submit.prevent="submit">
			<x-button :native-type="'submit'">
				{{ locale.search }}
			</x-button>
			<x-button
				v-if="searchResetable"
				@click="reset"
			>
				{{ locale.reset }}
			</x-button>
		</form>
	</div>
</template>

<script>
import XButton from './com/Button.vue';
export default {
	components:{ XButton },
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
	mounted(){
		if(this.searchFilter) {
			this.store.searchParams = this.getParams();
		}
	},
	methods: {
		search(){}
	}
};
</script>

<style>

</style>
