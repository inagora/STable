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
			:size="'small'"
			:label-width="labelWidth"
			:default-values="defVal"
			:label-visible="labelVisible"
			@submit="search"
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
			defVal: {
				name: '123' //test
			},
			labelWidth: 100
		};
	},
	methods: {
		search(evt) {
			let searchParams;
			if(this.ignoreEmptySearchParam) {
				searchParams = this.trimParam(evt);
				
			} else 
				searchParams = evt;
			
			let ret = this.store.emit('search', evt);
			if(ret===false)
				return;
			this.store.searchParams = searchParams;
			this.store.$emit('load', {reset: true});
		},
		reset() {
			this.$refs.form.resetFields();
		},
		trimParam(data){
			let params = {};
			for(let key in data) {
				if(typeof data[key]=='string') {
					if(data[key])
						params[key] = data[key];
				} else if(typeof data[key] != 'undefined') {
					params[key] = data[key];
				}
			}

			return params;
		}
	}
};
</script>

<style lang="scss">
.st-search{
	border-bottom: 1px solid #d0d0d0;
	padding: 10px 0 0 10px;
}
</style>
