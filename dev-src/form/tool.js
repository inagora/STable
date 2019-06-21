let class2type = {}
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(name => {
	class2type["[object " + name + "]"] = name.toLowerCase();
});

export const _typeOf = (obj) => {
	return obj == null ? String(obj) :
		class2type[toString.call(obj)] || "object";
}

export const _getValueByPath = (object, prop) => {
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
}

export const _valueEquals = (a, b) => {
  if (a === b) return true;
  if (!(a instanceof Array)) return false;
  if (!(b instanceof Array)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

// export {
//   _typeOf,
//   _getValueByPath,
// }