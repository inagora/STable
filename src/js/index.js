import STable from 'js/STable.vue';
import XForm from 'js/section/Form.vue';
import XDialog from 'js/com/Dialog.vue';
import Dialog from 'js/com/Dialog';
import SidePanel from 'js/com/SidePanel';

//注册全局组件
Vue.component('x-dialog', XDialog);
Vue.component('x-stable', STable);
Vue.component('x-form', XForm);

//添加全局变量
window.SidePanel = SidePanel;
window.Dialog = Dialog;

export var version = '5.0.0-beta1';
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
			}
		}
	}).$mount(el);
	return app;
}