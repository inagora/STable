import STable from './STable.vue';
import { Console } from './util/util';
import XForm from './form/index.vue';
export { create as createDialog } from './com/Dialog.js';
export { default as qtip } from './com/qtip.js';
export { default as Progressbar } from './com/Progressbar.js';

//注册全局组件
Vue.component('x-stable', STable);
Vue.component('x-form', XForm);

Console.log(
	'%c👩‍💻STable docs: https://inagora.github.io/STable/',
	'font-size:14px'
);

export var version = '2.0.26';
export function init(config, Vue) {
	let el = config.el || config.container || '#stableContainer';
	if (typeof el == 'string') {
		el = document.querySelector(el);
	} else if (el.length) {
		el = el[0];
	}

	if (!(el instanceof HTMLElement)) {
		Console.error('The container is not a dom, please check!');
		return null;
	}
	el.innerHTML = '<x-stable ref="stable" :config="config"></x-stable>';
	if (!Vue) {
		Vue = window.Vue;
	}
	if (!Vue || !Vue.version || Vue.version < '2') {
		Console.error('Please ensure Vue is installed.');
		return null;
	}
	let app = new Vue({
		data: {
			config
		}
	}).$mount(el);
	return app.$refs.stable;
}
