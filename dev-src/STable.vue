<template>
	<div class="st-stable" :class="[config.layoutMode=='expand'?'st-expand-stable':'st-fixed-stable']">
		<div class="st-stable-doc">
			<template v-for="com of comOrder">
				<component
					:is="com.com"
					:key="com.name"
					:ref="com.name"
				/>
			</template>
		</div>
	</div>
</template>
<script>
/**
 * STable.vue对外提供唯一的组件
 */
import XTitle from './Title.vue';
import XTip from './Tip.vue';
import XToolbar from './Toolbar.vue';
import XSearch from './Search.vue';
import XTable from './table/index.vue';
import XPagination from './Pagination.vue';
import defaultLang from './lang/en.js';
import {hashCode, Console, getFormData, mergeFormData} from "./util/util.js";
import Ajax from './util/Ajax.js';
let stableCount = 0;
export default {
	props: {
		config: {
			type: Object,
			required: true
		}
	},
	provide() {
		let conf = Object.assign({
			/**
			 * @param {String} title 标题，显示在顶部。并且用做导出excel的默认文件名
			 */
			title: '',
			/**
			 * @param {Boolean} rowNumberVisible 是否显示行号
			 */
			rowNumberVisible: false,
			/**
			 * @param {String} selectMode 选择模式，单选(none)/多选(multiple)/不显示(none)
			 */
			selectMode: 'none',
			/**
			 * @param {String} pageMode 分页模式。普通模式(normal)把所有数据分成等分的多少页，按页号取每页数据；瀑布流模式(waterfall)，根据当前页的第一项，向前取一页；或最后一项，向后取一页
			 */
			pageMode: 'normal', //normal、waterfall
			/**
			 * @param {String} pageIndex 如果分页模式是瀑布模式(waterfall)，需要指定由哪个数据字段决定分页，默认是id
			 */
			pageIndex: 'id',
			/**
			 * @param {Object} listeners STable组件支持的事件
			 */
			listeners: {},
			/**
			 * @param {Boolean} ignoreEmptySearchParam 忽略搜索条件中的空字符串
			 */
			ignoreEmptySearchParam: true,
			/**
			 * @param {Number} parallelCount 全量下载表格时，并行请求数
			 */
			parallelCount: 6,
			/**
			 * 全量下载表格时，根据下载速度，动态调整最大并行数
			 */
			dynamicParallelCount: false,
			/**
			 * @param {Number} downloadTimeout 全量下载表格时，每页的下载时间
			 */
			downloadTimeout: 30000,
			/**
			 * @param {Boolean} downloadAllFromJustOnePage 全量下载表格时，所有数据从一页一次性下载
			 */
			downloadAllFromJustOnePage: false,
			/**
			 * @param {Boolean} labelVisible 搜索区每个输入框是不是要显示名字
			 */
			labelVisible: true,
			/**
			 * @param {String} layoutMode 布局模式，固定高度(fixed)/高度自动伸缩(expand)
			 */
			layoutMode: 'fixed',
			/**
			 * @param {Boolean} searchResetable 搜索区是否显示“重置”按钮
			 */
			searchResetable: false,
			/**
			 * @param {Object[]} records 静态化数据，设置了它后，就不会动态加载数据了
			 */
			records: false,
			/**
			 * @param {String} idIndex 删除、批量删除、修改数据时，用来标识记录的数据
			 */
			idIndex: '',
			/**
			 * @param {String} addUrl 添加时的提交地址
			 */
			addUrl: '',
			/**
			 * @param {String} deleteUrl 删除时的提交地址
			 */
			deleteUrl: '',
			/**
			 * @param {String} updateUrl 更新时的提交地址
			 */
			updateUrl: '',
			/**
			 * @param {String} tip 顶部显示的提示
			 */
			tip: '',
			/**
			 * @param {Boolean} downloadable 显示下载按钮
			 */
			downloadable: false,
			/**
			 * @param {Array} searchFilter 搜索表单配置
			 */
			searchFilter: false,
		}, window.STable && window.STable.default||{}, this.config);

		//国际化
		if(!conf.locale) {
			conf.locale = defaultLang;
		}else if(typeof conf.locale == 'string') {
			if(window.STable && Window.STable.lang[conf.locale]) {
				conf.locale = Window.STable.lang[conf.locale];
				conf.locale = conf.locale.default||conf.locale;
			} else {
				conf.locale = defaultLang;
			}
		}

		if(conf.layoutMode != 'expand')
			conf.layoutMode == 'fixed';
		/**
		 * @param {Object} actionMethods STable在不同时机发请求时所用的方法
		 */
		let methods = conf.actionMethods||conf.requestMethod||'GET';
		if(typeof methods=='string'){
			methods = {read: methods};
		}
		let actionMethods = {
			create: 'POST',
			read: 'GET',
			update: 'POST',
			delete: 'POST'
		};
		conf.actionMethods = Object.assign(actionMethods, methods);

		/**
		 * @param {String|String[]} sublistAt 行内容分多子表
		 */
		if(conf.sublistAt){
			if(!Array.isArray(conf.sublistAt))
				conf.sublistAt = [conf.sublistAt];
		} else {
			conf.sublistAt = [];
		}

		/**
		 * @param {Object} additionalColumnConfig 额外的列配置
		 */
		/**
		 * @param {Object} acc additionalColumnConfig的别名
		 */
		let additionalColumnConfig = conf.additionalColumnConfig||conf.acc||false;

		/**
		 * @param {Object} columns 列配置
		 */
		let columns = conf.columns.map((item,idx)=>{
			/**
			 * @param {String} column.text 列头文本
			 */
			/**
			 * @param {String} column.dataIndex 列的数据id
			 */
			if(typeof item == 'string') {
				item = {
					text: item,
					dataIndex: item
				};
			}
			if(additionalColumnConfig) {
				if(Array.isArray(additionalColumnConfig)) {
					Object.assign(item, additionalColumnConfig[idx]);
				} else if(item.dataIndex && additionalColumnConfig[item.dataIndex]) {
					Object.assign(item, additionalColumnConfig[item.dataIndex]);
				}
			}
			if (item.header) {
				item.text = item.header;
			}

			/**
			 * @param {String[]|Object} column.options 此列显示的时候，不显示行数据dataIndex指定的值，也是从options找到对应的映射显示
			 */
			//防止有options字段，又没有配置可选值
			if (item.options && Object.keys(item.options).length<=0){
				item.options = false;
			}
			
			/**
			 * @param {Button[]} column.buttons 每一行显示的按钮
			 */
			/**
			 * @param {Number|String} column.width 列宽 
			 */

			/**
			 * @param {String} button.iconCls 按钮上显示的icon
			 */
			if (item.buttons) {
				if(!item.type)
					item.type = 'button';
			}
			if (!item.dataIndex) {
				item.dataIndex = "_st_column_"+idx;
			}

			/**
			 * @param {Function} column.render 列内容的渲染函数
			 */
			if (item.render) {
				item.type = 'render';
			}

			/**
			 * @param {Function} column.options 显示内容的映射
			 */
			if (item.options && !item.type) {
				item.type = 'option';
			}

			/**
			 * @param {String} column.type 列内容的类型
			 */
			if (!item.type) {
				item.type = 'text';
			}

			/**
			 * @param {Number} column.flex 使用权重而不是绝对值决定列宽
			 */
			if(typeof item.width=='undefined' && typeof item.flex=='undefined') {
				item.flex = 1;
			}

			let _type = typeof item.width;
			if(_type != 'undefined') {
				if(_type=='string') {
					//可能是百分比，否则全转化为整数
					if(!/^[\d.]+%$/.test(item.width)) {
						item.width = parseInt(item.width, 10);
					}
				}
			} else if(typeof item.flex != 'undefined') {
				item.flex = parseFloat(item.flex);
			} else {
				item.flex = 1;
			}

			/**
			 * @param {Boolean} column.visible 此列是否可见
			 * @param {Boolean|String} column.locked 此列是否锁定。可以取值true\false\'left'\'right'；为true时与'left'等效
			 * @param {Boolean} column.cellWrap 此列是否自动换行
			 * @param {Boolean} column.resizable 此列是不是可以缩放大小
			 */
			item = Object.assign({
				visible: true,
				locked: false,
				cellWrap: true,
				resizable: true,
				_st_ori_idx: idx,
				_hl: false
			},item);
			if(item.locked){
				if(item.locked != 'right')
					item.locked = 'left';
			} else {
				item.locked = false;
			}
			if(!item.text)
				item.text = '-';
			
			return item;
		});

		/**
		 * @param {Object} params 额外的搜索条件，每次请求页数据时，都会带上
		 */
		conf.params = mergeFormData(
			{
				count: 20
			}, 
			conf.params,
			//向前兼容，postParam、postData是之前版本使用过的名称
			conf.postParam,
			conf.postData
		);
		conf.urlSearchParams = {};
		if(stableCount==0 && window.location.search.includes('stable=on')) {
			let searchParams = getFormData(window.location.search);
			if(searchParams.get('stable')=='on'){
				searchParams.delete('stable');
				let sp = {};
				for(let p of searchParams){
					if(/(.+)\[\]$/.test(p[0])){
						let key = RegExp.$1;
						if(!sp[key]) {
							sp[key] = [p[1]];
						} else {
							sp[key].push(p[1]);
						}
					} else {
						sp[p[0]] = p[1];
					}
				}
				conf.urlSearchParams = sp;
			}
		}

		/**
		 * @param {String} updateUrl 更新时的地址
		 */
		if(conf.editUrl) {
			conf.updateUrl = conf.editUrl;
		}
		/**
		 * @param {Object[]} updateConfig 更新时的表单配置
		 */
		if(conf.updateUrl) {
			conf.updateConfig = conf.updateConfig||conf.editConfig||conf.editConf||conf.metaEditConf;
		} else {
			conf.updateConfig = {};
		}
		/**
		 * @param {String} addUrl 添加行时的提交的url
		 * @param {Object[]} addConfig 添加行的表单配置
		 */
		if(conf.addUrl) {
			conf.addConfig = conf.addConfig|| conf.addConf || conf.updateConfig;
		} else {
			conf.addConfig = {};
		}

		let selectMode = conf.selectMode.trim().toLowerCase();
		if(['radio', 'single'].includes(selectMode)){
			conf.selectMode = 'single';
		} else if(['checkbox', 'mul', 'multi', 'multiple'].includes(selectMode)){
			conf.selectMode = 'multiple';
		} else {
			conf.selectMode = 'none';
		}

		if(conf.batDeleteUrl){
			conf.selectMode = 'multiple';
		}

		if(typeof conf.page != 'undefined') {
			conf.params.page = conf.page;
		}

		if(conf.sort_key)
			conf.sortKey = conf.sort_key;
		if(conf.sort_direction)
			conf.sortDirection = conf.sort_direction;
		if(!conf.sortDirection)
			conf.sortDirection = 'asc';

		//一些默认的请求参数，通过ajaxSetting传递
		conf.ajax = new Ajax(conf.ajaxSetting);

		let loc = window.location;
		conf._storage_key = hashCode(loc.host+loc.pathname+JSON.stringify(columns));
		let localColumnSet;
		try{
			localColumnSet = window.localStorage.getItem(conf._storage_key);
			if(localColumnSet)
				localColumnSet = JSON.parse(localColumnSet);
		}catch(e){
			localColumnSet = '';
			alert('本地存储的列信息有问题');
		}
		if(localColumnSet) {
			let _columns = [];
			for(let col of localColumnSet) {
				for(let colConf of columns){
					if(colConf._st_ori_idx == col._st_ori_idx){
						Object.assign(colConf, {
							locked: col.locked,
							visible: col.visible,
							_st_idx: col._st_idx
						});
						_columns.push(colConf);
						break;
					}
				}
			}
			columns = _columns;
		}

		let self = this;
		conf.store = new Vue({
			data: {
				storageKey: conf._storage_key,
				columns,
				page: conf.params.page || 1,
				pageCount: 1,
				hasNextPage: true,
				hasPrePage: false,
				loadAction: '',
				radioVal: '',
				checkboxVal: [],
				chkAll: false,
				sortKey: conf.sortKey||'',
				sortDirection: conf.sortDirection,

				hlRowNum: -1,
				focusRowNum: -1
			},
			methods: {
				saveColumnsState(){
					let colState = this.columns.map(col=>{
						return {
							text: col.text,
							visible: col.visible,
							locked: col.locked,
							_st_idx: col._st_idx,
							_st_ori_idx: col._st_ori_idx
						};
					});

					try{
						window.localStorage.setItem(this.storageKey, JSON.stringify(colState));
					}catch(e){
						Console.error(e);
					}
				},
				resetColumnsState(){
					try{
						window.localStorage.removeItem(this.storageKey);
						location.reload();
					}catch(e){
						Console.error(e);
					}
				},
				emit(evtName, ...args){
					if(self.config.listeners && self.config.listeners[evtName]) {
						return self.config.listeners[evtName].apply(self, args);
					}
				}
			}
		});
		conf.store.searchParams = {};
		delete conf.columns;
		delete conf.params.page;

		return conf;
	},
	data(){
		/**
		 * @param {String[]} componentOrder 组件的展示顺序
		 */
		let coms = {
			title: XTitle,
			tip: XTip,
			toolbar: XToolbar,
			search: XSearch,
			table: XTable,
			pagination: XPagination
		};
		let order = [
			'title', 
			'tip', 
			'toolbar', 
			'search', 
			'table',
			'pagination'
		];
		if(this.config.componentOrder) {
			order = this.config.componentOrder;
		}
		return {
			comOrder: order.map(name=>({name, com:coms[name]}))
		};
	},
	mounted(){
		if(this.config.listeners && this.config.listeners.ready){
			this.config.listeners.ready.call(this);
		}
		stableCount++;
	},
	methods: {
		/**
		 * @member {Function} refresh 刷新表格
		 */
		refresh(pno) {
			return this.$refs.table[0].refresh(pno);
		},
		/**
		 * @member {Function} getSearchParam 获得当前搜索表单项内容
		 */
		getSearchParam(){
			return this.$refs.search[0].getParams();
		},
		getSelectRows(){
			return this.getSelected();
		},
		/**
		 * @member {Function} getSelectedRows 获得当前所有选中行的数据
		 */
		getSelectedRows(){
			return this.getSelected();
		},
		/**
		 * @member {Function} getSelected 获得当前所有选中行的数据
		 */
		getSelected(){
			return this.$refs.table[0].getSelectRows();
		},
		/**
		 * @member {Function} layout 重新布局表格
		 */
		layout(){
			this.$refs.table[0].layout();
		},
		/**
		 * @member {Function} setRecords 设置表格数据
		 */
		setRecords(list){
			this.$refs.table[0].setRecords(list);
		}
	}
};
</script>
<style lang="scss">
@import url(./iconfont/iconfont.css);
.st-stable{
	&,
	*,
	::before,
	::after{
		box-sizing: border-box;
	}
	border-top: 1px solid #d0d0d0;
}
.st-fixed-stable{
	position: relative;
	height: 100%;
}
.st-fixed-stable .st-stable-doc{
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;

	display: flex;
	flex-direction: column;
}

/*一些公用样式*/
.st-flex-padding{
	flex: 1;
}
</style>
