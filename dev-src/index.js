import STable from './STable.vue';
import {Console} from './util/util';
import XForm from './form/form.vue';
export {default as SidePanel} from './com/SidePanel.js';
export {create as createDialog} from './com/Dialog.js';
export {default as qtip} from './com/qtip.js';

//注册全局组件
Vue.component('x-stable', STable);
Vue.component('x-form', XForm);

Console.log('%cSTable doc：https://stable.wfxteam.com/',"color:#191919;font-size:14px");

export var version = '2.0.0';
export function init(config, Vue) {
	let el = config.el || config.container || '#stableContainer';
	if(typeof el == 'string') {
		el = document.querySelector(el);
	} else if (el.length) {
		el = el[0];
	}

	if(!(el instanceof HTMLElement)) {
		Console.error('STable的容器dom不正确，请检查!');
		return null;
	}
	el.innerHTML='<x-stable ref="stable" :config="config"></x-stable>';
	if(!Vue){
		Vue = window.Vue;
	}
	if(!Vue || !Vue.version || Vue.version<'2') {
		Console.error('请检查Vue是否安装');
		return null;
	}
	let app = new Vue({
		data: {
			config
		},
	}).$mount(el);
	return app.$refs.stable;
}