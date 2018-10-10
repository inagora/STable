<template>
	<div class="st-stable">
		<x-title></x-title>
		<x-tip></x-tip>
		<x-toolbar></x-toolbar>
		<x-search ref="search"></x-search>
		<x-table ref="table"></x-table>
		<x-pagination></x-pagination>
		<x-chart v-if="config.chart"></x-chart>
	</div>
</template>
<script>
	import XTitle from 'js/section/Title.vue';
	import XTip from 'js/section/Tip.vue';
	import XToolbar from 'js/section/Toolbar.vue';
	import XSearch from 'js/section/Search.vue';
	import XTable from 'js/section/Table.vue';
	import XPagination from 'js/section/Pagination.vue';
	import XChart from 'js/section/Chart.vue';
	let stableCount = 0;
	export default {
		props: ['config'],
		provide() {
			let conf = Object.assign({
				//app的标题，显示在顶部。并且用做导出excel的默认文件名
				title: '',
				rowNumberVisible: false,
				selectMode: 'none',
				pageMode: 'normal', //normal、waterfall
				pageIndex: 'id',
				listeners: {},
				ignoreEmptySearchParam: true,
				params: {
					count: 20
				},
				parallelCount: 6
			}, this.config);

			let methods = conf.actionMethods||conf.requestMethod||'GET';
			if(typeof methods=='string'){
				methods = {read: methods};
			}
			let actionMethods = {
				create: 'POST',
				read: 'GET',
				update: 'POST',
				destroy: 'POST'
			};
			conf.actionMethods = Object.assign({}, actionMethods, methods);

			let columns = conf.columns.map((item,idx)=>{
				if(typeof item == 'string') {
					item = {
						text: item,
						dataIndex: item
					};
				}
				if (item.header) {
					item.text = item.header;
				}
				if (item.buttons) {
					if(!item.type)
						item.type = 'button';
					item.buttons.forEach(btn=>{
						if(btn.icon) {
							if(!btn.icon.startsWith('el-icon-')){
								btn.icon = 'el-icon-_fa fa fa-'+btn.icon;
							}
						}
					});
				}
				if (!item.dataIndex) {
					item.dataIndex = "stable_column_"+idx;
				}
				if (item.render) {
					item.type = 'render';
				}
				if (!item.type) {
					item.type = 'text';
				}
				if(typeof item.width=='undefined' && typeof item.flex=='undefined') {
					item.flex = 1;
				}

				if(typeof item.width!='undefined') {
					if(typeof item.width=='string') {}
				}

				let _type = typeof item.width;
				if(_type != 'undefined') {
					if(_type=='string') {
						//可能是百分比，否则全转化为整数
						if(!/^[\d\.]+%$/.test(item.width)) {
							item.width = parseInt(item.width, 10);
						}
					}
				} else if(typeof item.flex != 'undefined') {
					item.flex = parseFloat(item.flex);
				} else {
					item.flex = 1;
				}
				item = Object.assign({
					visible: true,
					locked: false,
					_st_idx: idx
				},item);
				if(!item.text)
					item.text = '-';
				if(item.fx)
					item.fx = item.fx.toLowerCase();
				return item;
			});

			if(stableCount==0 && window.location.search.includes('stable=on')) {
				let searchParams = new URLSearchParams(window.location.search);
				let sp = {};
				for(let key of searchParams.keys()) {
					let val = searchParams.getAll(key);
					if(val.length>1)
						sp[key] = val;
					else
						sp[key] = val[0];
				}
				delete sp.stable;

				//兼容之前版使用的postParam 和 postData
				Object.assign(conf.params, conf.postParam, conf.postData, sp);
			}

			if(conf.addUrl) {
				conf.addConf = conf.addConf || conf.editConfig||conf.editConf||conf.metaEditConf;
			}
			if(conf.editUrl) {
				conf.updateUrl = conf.editUrl;
			}
			if(conf.updateUrl) {
				conf.editConf = conf.editConfig||conf.editConf||conf.metaEditConf;
			}
			let selectMode = conf.selectMode.trim().toLowerCase();
			if(['radio', 'single'].includes(selectMode)){
				conf.selectMode = 'single';
			} else if(['checkbox', 'multi', 'multiple'].includes(selectMode)){
				conf.selectMode = 'multiple';
			} else {
				conf.selectMode = 'none';
			}

			if(typeof conf.page != 'undefined') {
				conf.params.page = conf.page;
			}

			conf.store = new Vue({
				data: {
					columns,
					page: conf.params.page || 1,
					page_count: 1,
					hasNextPage: true,
					hasPrePage: false,
					loadAction: '',
					radioVal: '',
					checkboxVal: []
				}
			});
			conf.store.searchParams = {};
			conf.store.$on('cellclick', evt=>{
				if(conf.listeners.cellclick){
					conf.listeners.cellclick.call(this.$root, evt.record, evt.col, evt.evt);
				}
			});
			conf.store.$on('rowclick', evt=>{
				if(conf.listeners.rowclick) {
					conf.listeners.rowclick.call(this.$root, evt.record, evt.evt);
				}
			});
			conf.store.$on('refresh', records=>{
				if(conf.listeners.refresh) {
					conf.listeners.refresh.call(this.$root, records);
				}
			});
			delete conf.columns;
			delete conf.params.page;
			
			return conf;
		},
		components: {
			XTitle,
			XTip,
			XToolbar,
			XSearch,
			XTable,
			XPagination,
			XChart
		},
		mounted(){
			if(this.config.listeners && this.config.listeners.ready){
				this.config.listeners.ready.call(this.$root);
			}
		},
		methods: {
			refresh(pno) {
				return this.$refs.table.refresh(pno);
			},
			getSearchParam(){
				return this.$refs.search.getParams();
			},
			getSelectRows(){
				return this.$refs.table.getSelectRows();
			}
		}
	}
</script>
<style>
	@import url(../css/index.css);
	.st-stable{
		height: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
	}
</style>