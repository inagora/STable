<template>
	<div v-if="searchFilter" class="st-search">
		<x-form ref="form" :inline="true" size="small" :field-list="searchFilter" :default-values="params" :action-methods="actionMethods" @submit="search">
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" native-type="submit">查询</el-button>
			</el-form-item>
		</x-form>
	</div>
</template>
<script>
	import XForm from './Form.vue';
import { parse } from 'semver';
	export default {
		components:{XForm},
		inject: {
			searchFilter: {
				default: false
			},
			listeners: 'listeners',
			actionMethods: 'actionMethods',
			params: 'params',
			store: 'store',
			ignoreEmptySearchParam: 'ignoreEmptySearchParam'
		},
		methods: {
			search(evt){
				let searchParams;
				if(this.ignoreEmptySearchParam) {
					let params = {};
					for(let key in evt) {
						if(typeof evt[key]=='string') {
							if(evt[key])
								params[key] = evt[key];
						} else if(typeof evt[key] != 'undefined') {
							params[key] = evt[key];
						}
					}
					searchParams = params;
					
				} else 
					searchParams = evt;
				
				if(this.listeners.search) {
					if(this.listeners.search.call(this.$root, searchParams)===false) {
						return;
					}
				}
				this.store.searchParams = searchParams;
				console.log('search')
				this.store.$emit('load', {reset: true});
			},
			getParams(){
				return this.$refs.form.getFormData();
			}
		}
	};
</script>
<style>
.st-search{
	border-bottom: 1px solid #d0d0d0;
	padding: 6px 0 0 8px;
}
.st-search .el-form-item--small.el-form-item{
	margin-bottom: 6px;
}
.st-search .el-form--inline .el-form-item__label{
	padding-right: 5px;
}
.st-search .el-input el-input--small{
	width: 120px;
}
</style>