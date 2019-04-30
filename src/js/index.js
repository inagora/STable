import STable from 'js/STable.vue';
import XForm from 'js/section/Form.vue';
import XDialog from 'js/com/Dialog.vue';
import Dialog from 'js/com/Dialog';
import SidePanel from 'js/com/SidePanel';
import Progressbar from 'js/com/Progressbar';

//注册全局组件
Vue.component('x-dialog', XDialog);
Vue.component('x-stable', STable);
Vue.component('x-form', XForm);

//添加全局变量
window.SidePanel = SidePanel;
window.Dialog = Dialog;
window.Progressbar = Progressbar;
console.log('%c👨‍💻STable',"color:#205424;font-size:18px");
console.log('%c文档地址：https://stable.wfxteam.com/',"color:#191919;font-size:14px");
export var version = '1.0.7';
export function init(config){
	let el = config.el || config.container || '#wdStableContainer';
	if(typeof el == 'string') {
		el = document.querySelector(el);
	} else if (el.length) {
		el = el[0];
	}

	el.innerHTML='<x-stable ref="stable" :config="config"></x-stable>';

	let app = new Vue({
		data: {config},
		methods: {
			refresh(pno){
				return this.$refs.stable.refresh(pno);
			},
			getSearchParam(){
				return this.$refs.stable.getSearchParam();
			},
			getSelectedRows(){
				return this.$refs.stable.getSelectRows();
			},
			layout(){
				this.$refs.stable.layout();
			},
			setRecords(list){
				this.$refs.stable.setRecords(list);
			}
		}
	}).$mount(el);
	return app;
}