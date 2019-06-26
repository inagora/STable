let class2type = {}
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(name => {
	class2type["[object " + name + "]"] = name.toLowerCase();
});
function _broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    var name = child.$options.componentName;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      _broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
// function _t(...args) {
//   return _t.apply(this, args);
// }

export default {
  methods: {
    _dispatch(componentName, eventName, params){
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    _broadcast(componentName, eventName, params){
      _broadcast.call(this, componentName, eventName, params);
    },
    _typeOf(obj){
      return obj == null ? String(obj) :
        class2type[toString.call(obj)] || "object";
    },
    _getValueByPath(object, prop){
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
    },
    _valueEquals(a, b){
      if (a === b) return true;
      if (!(a instanceof Array)) return false;
      if (!(b instanceof Array)) return false;
      if (a.length !== b.length) return false;
      for (let i = 0; i !== a.length; ++i) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    },
    _focus(ref) {
      this.$refs[ref].focus();
    },
    // _t(...args) {
    //   return this._t.apply(this, args);
    // }
  },
};