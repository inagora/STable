import Vue from 'vue';

let class2type = {};
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(name => {
	class2type["[object " + name + "]"] = name.toLowerCase();
});

//自定义指令 clickoutside
const on = (function () {
	if (!Vue.prototype.$isServer && document.addEventListener) {
		return function (element, event, handler) {
			if (element && event && handler) {
				element.addEventListener(event, handler, false);
			}
		};
	} else {
		return function (element, event, handler) {
			if (element && event && handler) {
				element.attachEvent('on' + event, handler);
			}
		};
	}
})();

const nodeList = [];
const ctx = '@@clickoutsideContext';

let startClick;
let seed = 0;

!Vue.prototype.$isServer && on(document, 'mousedown', e => (startClick = e));

!Vue.prototype.$isServer && on(document, 'mouseup', e => {
	nodeList.forEach(node => node[ctx].documentHandler(e, startClick));
});

function createDocumentHandler(el, binding, vnode) {
	return function (mouseup = {}, mousedown = {}) {
		if (!vnode ||
			!vnode.context ||
			!mouseup.target ||
			!mousedown.target ||
			el.contains(mouseup.target) ||
			el.contains(mousedown.target) ||
			el === mouseup.target ||
			(vnode.context.popperElm &&
				(vnode.context.popperElm.contains(mouseup.target) ||
					vnode.context.popperElm.contains(mousedown.target)))) {
			return;
		}

		if (binding.expression &&
			el[ctx].methodName &&
			vnode.context[el[ctx].methodName]) {
			vnode.context[el[ctx].methodName]();
		} else {
			el[ctx].bindingFn && el[ctx].bindingFn();
		}
	};
}
export const _clickOutside = {
	bind(el, binding, vnode) {
		nodeList.push(el);
		const id = seed++;
		el[ctx] = {
			id,
			documentHandler: createDocumentHandler(el, binding, vnode),
			methodName: binding.expression,
			bindingFn: binding.value
		};
	},

	update(el, binding, vnode) {
		el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
		el[ctx].methodName = binding.expression;
		el[ctx].bindingFn = binding.value;
	},

	unbind(el) {
		let len = nodeList.length;

		for (let i = 0; i < len; i++) {
			if (nodeList[i][ctx].id === el[ctx].id) {
				nodeList.splice(i, 1);
				break;
			}
		}
		delete el[ctx];
	}
};

export const _typeOf = function (obj) {
	return obj == null ? String(obj) :
		class2type[toString.call(obj)] || "object";
};
export const _getValueByPath = function (object, prop) {
	prop = prop || '';
	const paths = prop.split('.');
	let current = object;
	let result = null;
	for (let i = 0, j = paths.length; i < j; i++) {
		const path = paths[i];
		if (!current) break;

		if (i === j - 1) {
			result = current[path];
			break;
		}
		current = current[path];
	}
	return result;
};
export default {_clickOutside,_typeOf,_getValueByPath};