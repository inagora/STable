<template>
  <li
      @mouseenter="hoverItem"
      @click.stop="selectOptionClick"
      class="st-select-option"
      v-show="visible"
      :class="{
        'selected': itemSelected,
        'is-disabled': disabled || limitReached,
        'hover': hover
      }">
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script>
// import {_typeOf,_getValueByPath,_valueEquals} from '../tool';
import Tool from '../tool';

const regExpString = (value = '') => String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');

export default {
  mixins: [Tool],
  name: 'XOption',
  componentName: 'XOption',
  inject: ['select'],
  props: {
    value: {
      required: true
    },
    label: [String, Number],
    created: Boolean,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      index: -1,
      visible: true,
      hitState: false,
      hover: false
    };
  },
  computed:{
    itemSelected() {
      if (!this.select.multiple) {
        return this._valueEquals(this.value, this.select.value);
      } else {
        return this.contains(this.select.value, this.value);
      }
    },
    currentLabel() {
      return this.label || ($type(this.value) == 'object' ? '' : this.value);
    },
    currentValue() {
      return this.value || this.label || '';
    },
  },
  watch:{
    currentLabel() {
      if (!this.created && !this.select.remote) this._dispatch('XSelect', 'setSelected');
    },
    value(val, oldVal) {
      const { remote, valueKey } = this.select;
      if (!this.created && !remote) {
        if (valueKey && typeof val === 'object' && typeof oldVal === 'object' && val[valueKey] === oldVal[valueKey]) {
          return;
        }
        this._dispatch('XSelect', 'setSelected');
      }
    }
  },
  created() {
    this.select.options.push(this);
    this.select.cachedOptions.push(this);
    this.select.optionsCount++;
    this.select.filteredOptionsCount++;
    this.$on('queryChange', this.queryChange);
  },
  beforeDestroy() {
    this.select.onOptionDestroy(this.select.options.indexOf(this));
  },
  methods: {
    contains(arr = [], target) {
      if (this._typeOf(this.value) != 'object') {
        return arr && arr.indexOf(target) > -1;
      } else {
        const valueKey = this.select.valueKey;
        return arr && arr.some(item => {
          return this._getValueByPath(item, valueKey) === this._getValueByPath(target, valueKey);
        });
      }
    },
    selectOptionClick() {
      if (this.disabled !== true) {
        this._dispatch('XSelect', 'handleOptionClick', [this, true]);
      }
    },
    queryChange(query) {
      this.visible = new RegExp(regExpString(query), 'i').test(this.currentLabel) || this.created;
      if (!this.visible) {
        this.select.filteredOptionsCount--;
      }
    },
  },
}
</script>