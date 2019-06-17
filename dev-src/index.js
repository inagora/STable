import STable from './STable.vue';

var ss = require('./com/qtip.js');
window.ss = ss;

//注册全局组件
Vue.component('x-stable', STable);

console.log('%c👨‍💻STable',"color:#205424;font-size:18px");
console.log('%c文档地址：https://stable.wfxteam.com/',"color:#191919;font-size:14px");

export var version = '2.0.0';
export function init(config, Vue) {
	let el = config.el || config.container || '#wdStableContainer';
	if(typeof el == 'string') {
		el = document.querySelector(el);
	} else if (el.length) {
		el = el[0];
	}

	if(!el instanceof HTMLElement) {
		console.error('STable的容器dom不正确，请检查!');
		return null;
	}
	el.innerHTML='<x-stable ref="stable" :config="config"></x-stable>';
	if(!Vue){
		Vue = window.Vue;
	}
	if(!Vue || !Vue.version || Vue.version<'2') {
		console.error('请检查Vue是否安装');
		return null;
	}
	let app = new Vue({
		data: {
			config
		},
	}).$mount(el);
	return app.$refs.stable;
}