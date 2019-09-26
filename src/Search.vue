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
			inline
			:field-list="searchFilter"
			:default-values="urlSearchParams"
			size="small"
			:label-visible="labelVisible"
			@submit="search"
		>
			<x-button
				:conf="{
					nativeType: 'submit',
					type: 'primary',
					icon: 'st-iconfont st-icon-search',
					text: locale.search
				}"
			/>
			<x-button
				v-if="searchResetable"
				:conf="{
					cls: 'st-search-reset-btn',
					text: locale.reset
				}"
				@click.prevent="reset"
			/>
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
		'urlSearchParams',
		'params',
		'store',
		'ignoreEmptySearchParam',
		'locale'
	],
	methods: {
		search(evt) {
			let searchParams = Object.assign({}, this.urlSearchParams, evt);
			if(this.ignoreEmptySearchParam) {
				searchParams = this.trimParam(searchParams);
				
			}
			
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

	&-reset-btn{
		margin-left: 10px;
	}
}
</style>
