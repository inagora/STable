let class2type = {};
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(name => {
	class2type["[object " + name + "]"] = name.toLowerCase();
});

//自定义指令
export const _clickOutside =  {
	bind(el, binding) {
		function documentHandler(e) {
			if (el.contains(e.target)) {
				return false;
			}
			if (binding.expression) {
				binding.value(e);
			}
		}
		el.__vueClickOutside__ = documentHandler;
		document.querySelector('body').addEventListener('click', documentHandler);
	},
	update() {},
	unbind(el) {
		document.querySelector('body').removeEventListener('click', el.__vueClickOutside__);
		delete el.__vueClickOutside__;
	},
};
// function _t(...args) {
//   return _t.apply(this, args);
// }

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
export const _valueEquals = function (a, b) {
	if (a === b) return true;
	if (!(a instanceof Array)) return false;
	if (!(b instanceof Array)) return false;
	if (a.length !== b.length) return false;
	for (let i = 0; i !== a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
};
export default {_clickOutside,_typeOf,_getValueByPath,_valueEquals};