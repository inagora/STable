<template>
	<div v-if="searchFilter" class="st-search" :class="{'st-search-label-invisible':!labelVisible}">
		<x-form ref="form" :inline="true" size="small" :field-list="searchFilter" :default-values="params" :action-methods="actionMethods" @submit="search">
			<el-form-item>
				<el-button type="primary" icon="fa fa-search" native-type="submit">{{locale.search}}</el-button>
				<el-button v-if="searchResetable" @click="reset">{{locale.reset}}</el-button>
			</el-form-item>
		</x-form>
	</div>
</template>
<script>
	import XForm from './Form.vue';
	export default {
		components:{XForm},
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
			setTimeout(()=>{
				if(this.searchFilter) {
					this.store.searchParams = this.getParams();
				}
				this.store.$emit('load');
			}, 0);
		},
		methods: {
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
			},
			search(evt){
				let searchParams;
				if(this.ignoreEmptySearchParam) {
					searchParams = this.trimParam(evt);
					
				} else 
					searchParams = evt;
				
				if(this.listeners.search) {
					if(this.listeners.search.call(this.$parent, searchParams)===false) {
						return;
					}
				}
				this.store.searchParams = searchParams;
				this.store.$emit('load', {reset: true});
			},
			getParams(){
				let data = this.$refs.form.getFormData();
				if(this.ignoreEmptySearchParam) {
					data = this.trimParam(data);
				}
				return data;
			},
			reset(){
				this.$refs.form.reset();
				this.search();
			}
		}
	};
</script>
<style>
.st-search{
	border-bottom: 1px solid #d0d0d0;
	padding: 6px 0 0 8px;
}
.st-search-label-invisible .el-form-item__label{
	display: none;
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

.st-search .el-input__inner{
	color: #333;
}
.st-search .el-select__tags-text{
	color: #444;
}
</style>