<template>
  <div class="st-select"
       @click.stop="toggleMenu">
    <div class="st-select-tags"
         v-if="multiple"
         ref="tags">
      <span v-show="selected.length">
        <x-tag
          type="info"
          v-for="item in selected"
          :key="getValueKey(item)"
          class="st-select-tags-item"
          :closable="!selectDisabled"
          @close="deleteTag($event, item)">
          <span class="st-select-tags-text">{{item.currentLabel}}</span>
          <span class="st-select-tags-text">{{selected.length}}</span>
        </x-tag>
      </span>
      <!-- 搜索框 -->
      <input
        type="text"
        class="st-select-input"
        :disabled="selectDisabled"
        @focus="handleFocus"
        @blur="softFocus = false"
        @click.stop
        @keyup="managePlaceholder"
        @keydown="resetInputState"
        @keydown.down.prevent="navigateOptions('next')"
        @keydown.up.prevent="navigateOptions('prev')"
        @keydown.enter.prevent="selectOption"
        @keydown.esc.stop.prevent="visible = false"
        @keydown.delete="deletePrevTag"
        v-model="query"
        @input="handleQueryChange"
        v-if="filterable"
        ref="input">
    </div>
    <x-input
      ref="reference"
      v-model="selectedLabel"
      type="text"
      :placeholder="currentPlaceholder"
      :name="name"
      :id="id"
      :disabled="selectDisabled"
      :readonly="readonly"
      class="st-input"
      :class="{ 'is-focus': visible }"
      @focus="handleFocus"
      @blur="handleBlur"
      @keyup.native="onInputChange"
      @keydown.native.down.stop.prevent="navigateOptions('next')"
      @keydown.native.up.stop.prevent="navigateOptions('prev')"
      @keydown.native.enter.prevent="selectOption"
      @keydown.native.esc.stop.prevent="visible = false"
      @keydown.native.tab="visible = false"
      @paste.native="onInputChange"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false">
      <template slot="prefix" v-if="$slots.prefix">
        <slot name="prefix"></slot>
      </template>
      <template slot="suffix">
        <i v-show="!showClose" class="st-iconfont st-icon-arrowdown"></i>
        <i v-show="showClose" class="st-iconfont st-icon-close-circle-fill" @click="handleClearClick"></i>
      </template>
    </x-input>
    <div class="st-select-menu" v-show="visible && emptyText !== false">
      <ul v-show="options.length > 0">
        <x-option 
          class="st-select-menu-item"
          :value="query"
          created
          v-if="showNewOption">
        </x-option>
        <slot></slot>
      </ul>
    </div>
  </div>
</template>

<script>
import XTag from './tag.vue'
import XInput from './input.vue'
import XOption from './coms/option.vue'
import Tool from './tool';

export default {
  mixins: [Tool],
  name: 'XSelect',
  componentName: 'XSelect',
  provide() {
    return {
      'XSelect': this
    };
  },
  components:{XTag,XInput,XOption},
  props:{
    name: String,
    id: String,
    value: {
      required: true
    },
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    allowCreate: Boolean,
    multiple: Boolean,
    placeholder: String,
    reserveKeyword: Boolean,
    defaultFirstOption: Boolean,
    valueKey: {
      type: String,
      default: 'value'
    },
    multipleLimit: {
      type: Number,
      default: 0
    },
  },
  data(){
    return {
      options: [],
      hoverOption: '',
      cachedOptions: [],
      createdLabel: null,
      createdSelected: false,
      selected: this.multiple ? [] : {},
      inputLength: 20,
      inputWidth: 0,
      initialInputHeight: 0,
      cachedPlaceHolder: '',
      optionsCount: 0,
      filteredOptionsCount: 0,
      visible: false,
      softFocus: false,
      selectedLabel: '',
      hoverIndex: -1,
      query: '',
      previousQuery: null,
      inputHovering: false,
      currentPlaceholder: '',
      menuVisibleOnFocus: false,
      isOnComposition: false,
      isSilentBlur: false,
    }
  },
  computed: {
    readonly() {
      return !this.filterable || this.multiple || !this.visible;
    },
    showClose() {
      let hasValue = this.multiple
          ? Array.isArray(this.value) && this.value.length > 0
          : this.value !== undefined && this.value !== null && this.value !== '';
      let criteria = this.clearable &&
          !this.selectDisabled &&
          this.inputHovering &&
          hasValue;
        return criteria;
    },
    showNewOption() {
      let hasExistingOption = this.options.filter(option => !option.created)
        .some(option => option.currentLabel === this.query);
      return this.filterable && this.allowCreate && this.query !== '' && !hasExistingOption;
    },
    selectDisabled() {
      return this.disabled;
    },
    optionsAllDisabled() {
      return this.options.filter(option => option.visible).every(option => option.disabled);
    },
    // value() {
    //   console.log('computed value')
    //   if (this.multiple) {
    //     this.resetInputHeight();
    //     if ((this.value && this.value.length > 0) || (this.$refs.input && this.query !== '')) {
    //       this.currentPlaceholder = '';
    //     } else {
    //       this.currentPlaceholder = this.cachedPlaceHolder;
    //     }
    //     if (this.filterable && !this.reserveKeyword) {
    //       this.query = '';
    //       this.handleQueryChange(this.query);
    //     }
    //   }
    //   this.setSelected();
    //   if (this.filterable && !this.multiple) {
    //     this.inputLength = 20;
    //   }
    //   // if (!this._valueEquals(val, oldVal)) {
    //   //   this._dispatch('XSelect', 'change', val);
    //   // }
    // },
  },
  watch: {
    selectDisabled() {
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },
    // selected(val, oldVal) {
    //   if (!this._valueEquals(val, oldVal)) {
        
    //   let result = [];
    //   if (Array.isArray(this.value)) {
    //     this.value.forEach(value => {
    //       result.push(this.getOption(value));
    //     });
    //   }
    //   this.selected = result;
    //   // console.log(this.selected)
    //   }
    // },
    // value: {
    //   immediate: true,
    //   handler: function(val, oldVal) {
    //     console.log('watch value')
    //     if (this.multiple) {
    //       this.resetInputHeight();
    //       if ((val && val.length > 0) || (this.$refs.input && this.query !== '')) {
    //         this.currentPlaceholder = '';
    //       } else {
    //         this.currentPlaceholder = this.cachedPlaceHolder;
    //       }
    //       if (this.filterable && !this.reserveKeyword) {
    //         this.query = '';
    //         this.handleQueryChange(this.query);
    //       }
    //     }
    //     this.setSelected();
    //     if (this.filterable && !this.multiple) {
    //       this.inputLength = 20;
    //     }
    //     if (!this._valueEquals(val, oldVal)) {
    //       this._dispatch('XSelect', 'change', val);
    //     }
    //   },
    //   deep: true
    // },
    visible(val) {
      if (!val) {
        if (this.$refs.input) {
          this.$refs.input.blur();
        }
        this.query = '';
        this.previousQuery = null;
        this.selectedLabel = '';
        this.inputLength = 20;
        this.menuVisibleOnFocus = false;
        this.resetHoverIndex();
        this.$nextTick(() => {
          if (this.$refs.input &&
            this.$refs.input.value === '' &&
            this.selected.length === 0) {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
        });
        if (!this.multiple) {
          if (this.selected) {
            if (this.filterable && this.allowCreate &&
              this.createdSelected && this.createdLabel) {
              this.selectedLabel = this.createdLabel;
            } else {
              this.selectedLabel = this.selected.currentLabel;
            }
            if (this.filterable) this.query = this.selectedLabel;
          }
          if (this.filterable) {
            this.currentPlaceholder = this.cachedPlaceHolder;
          }
        }
      } else {
        if (this.filterable) {
          this.query = this.selectedLabel;
          this.handleQueryChange(this.query);
          if (this.multiple) {
            this.$refs.input.focus();
          } else {
            this._broadcast('XOption', 'queryChange', '');
            if (this.selectedLabel) {
              this.currentPlaceholder = this.selectedLabel;
              this.selectedLabel = '';
            }
          }
        }
      }
      this.$emit('visible-change', val);
    },
    options() {
      console.log('options')
      if (this.$isServer) return;
      if (this.multiple) {
        this.resetInputHeight();
      }
      let inputs = this.$el.querySelectorAll('input');
      if ([].indexOf.call(inputs, document.activeElement) === -1) {
        this.setSelected();
      }
      if (this.defaultFirstOption && (this.filterable) && this.filteredOptionsCount) {
        this.checkDefaultFirstOption();
      }
    },
    placeholder(val) {
      this.cachedPlaceHolder = this.currentPlaceholder = val;
    },
    hoverIndex(val) {
      if (typeof val === 'number' && val > -1) {
        this.hoverOption = this.options[val] || {};
      }
      this.options.forEach(option => {
        option.hover = this.hoverOption === option;
      });
    }
  },
  methods: {
    navigateOptions(direction) {
      if (!this.visible) {
        this.visible = true;
        return;
      }
      if (this.options.length === 0 || this.filteredOptionsCount === 0) return;
      if (!this.optionsAllDisabled) {
        if (direction === 'next') {
          this.hoverIndex++;
          if (this.hoverIndex === this.options.length) {
            this.hoverIndex = 0;
          }
        } else if (direction === 'prev') {
          this.hoverIndex--;
          if (this.hoverIndex < 0) {
            this.hoverIndex = this.options.length - 1;
          }
        }
        const option = this.options[this.hoverIndex];
        if (option.disabled === true ||
          option.groupDisabled === true ||
          !option.visible) {
          this.navigateOptions(direction);
        }
        // this.$nextTick(() => this.scrollToOption(this.hoverOption));
      }
    },
    managePlaceholder() {
      if (this.currentPlaceholder !== '') {
        this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
      }
    },
    handleQueryChange(val) {
      console.log('handleQueryChange')
      if (this.previousQuery === val) return;
      if (this.previousQuery === null ) {
        this.previousQuery = val;
        return;
      }
      this.previousQuery = val;
      // this.$nextTick(() => {
      //   if (this.visible) this._broadcast('ElSelectDropdown', 'updatePopper');
      // });
      this.hoverIndex = -1;
      if (this.multiple && this.filterable) {
        this.$nextTick(() => {
          const length = this.$refs.input.value.length * 15 + 20;
          this.inputLength = length;
          this.managePlaceholder();
          this.resetInputHeight();
        });
      }
      this.filteredOptionsCount = this.optionsCount;
      this._broadcast('XOption', 'queryChange', val);
      // if (this.remote && typeof this.remoteMethod === 'function') {
      //   this.hoverIndex = -1;
      //   this.remoteMethod(val);
      // } else if (typeof this.filterMethod === 'function') {
      //   this.filterMethod(val);
      //   this._broadcast('ElOptionGroup', 'queryChange');
      // } else {
      //   this.filteredOptionsCount = this.optionsCount;
      //   this._broadcast('XOption', 'queryChange', val);
      //   this._broadcast('ElOptionGroup', 'queryChange');
      // }
      if (this.defaultFirstOption && (this.filterable ) && this.filteredOptionsCount) {
        this.checkDefaultFirsstOption();
      }
    },
    getOption(value) {
      console.log('getOption')
      let option;
      
      for (let i = this.cachedOptions.length - 1; i >= 0; i--) {
        const cachedOption = this.cachedOptions[i];
        const isObj = this._typeOf(value) == 'object'
          ? this._getValueByPath(cachedOption.value, this.valueKey) === this._getValueByPath(value, this.valueKey)
          : cachedOption.value === value;
        if (isObj) {
          option = cachedOption;
          break;
        }
      }
      if (option) return option;
      const label = (this._typeOf(value) == 'object' && this._typeOf(value) == 'null' && this._typeOf(value) == 'undefined')
        ? value : '';
      let newOption = {
        value: value,
        currentLabel: label
      };
      if (this.multiple) {
        newOption.hitState = false;
      }
      return newOption;
    },
    emitChange(val) {
      console.log(this.value)
      if (!this._valueEquals(this.value, val)) {
        this.$emit('change', val);
        this.valChange(this.value,val)
        this.value = val;
      }
    },
    setSelected() {
      console.log('setSelected')
      if (!this.multiple) {
        let option = this.getOption(this.value);
        if (option.created) {
          this.createdLabel = option.currentLabel;
          this.createdSelected = true;
        } else {
          this.createdSelected = false;
        }
        this.selectedLabel = option.currentLabel;
        this.selected = option;
        if (this.filterable) this.query = this.selectedLabel;
        return;
      }
      let result = [];
      if (Array.isArray(this.value)) {
        this.value.forEach(value => {
          result.push(this.getOption(value));
        });
      }
      this.selected = result;
      // console.log(this.selected)
      this.$nextTick(() => {
        this.resetInputHeight();
      });
    },
    handleFocus(event) {
      if (!this.softFocus) {
        if (this.filterable) {
          this.visible = true;
          this.menuVisibleOnFocus = true;
        }
        this.$emit('focus', event);
      } else {
        this.softFocus = false;
      }
    },
    blur() {
      this.visible = false;
      this.$refs.reference.blur();
    },
    handleBlur(event) {
      setTimeout(() => {
        if (this.isSilentBlur) {
          this.isSilentBlur = false;
        } else {
          this.$emit('blur', event);
        }
      }, 50);
      this.softFocus = false;
    },
    handleClearClick(event) {
      this.deleteSelected(event);
    },
    handleClose() {
      this.visible = false;
    },
    deletePrevTag(e) {
      if (e.target.value.length <= 0) {
        const value = this.value.slice();
        value.pop();
        this.$emit('input', value);
        this.emitChange(value);
      }
    },
    managePlaceholder() {
      if (this.currentPlaceholder !== '') {
        this.currentPlaceholder = this.$refs.input.value ? '' : this.cachedPlaceHolder;
      }
    },
    resetInputState(e) {
      this.inputLength = this.$refs.input.value.length * 15 + 20;
      this.resetInputHeight();
    },
    resetInputHeight() {
      console.log('resetInputHeight')
      if (!this.filterable) return;
      this.$nextTick(() => {
        if (!this.$refs.reference) return;
        let inputChildNodes = this.$refs.reference.$el.childNodes;
        let input = [].filter.call(inputChildNodes, item => item.tagName === 'INPUT')[0];
        const tags = this.$refs.tags;
        const sizeInMap = this.initialInputHeight || 40;
        if (input)
        input.style.height = this.selected.length === 0
          ? sizeInMap + 'px'
          : Math.max(
            tags ? (tags.clientHeight + (tags.clientHeight > sizeInMap ? 6 : 0)) : 0,
            sizeInMap
          ) + 'px';
      });
    },
    resetHoverIndex() {
      setTimeout(() => {
        if (!this.multiple) {
          this.hoverIndex = this.options.indexOf(this.selected);
        } else {
          if (this.selected.length > 0) {
            this.hoverIndex = Math.min.apply(null, this.selected.map(item => this.options.indexOf(item)));
          } else {
            this.hoverIndex = -1;
          }
        }
      }, 300);
    },
    handleOptionSelect(option, byClick) {
      if (this.multiple) {
        const value = (this.value || []).slice();
        const optionIndex = this.getValueIndex(value, option.value);
        if (optionIndex > -1) {
          value.splice(optionIndex, 1);
        } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
          value.push(option.value);
        }
        this.$emit('input', value);
        this.emitChange(value);
        if (option.created) {
          this.query = '';
          this.handleQueryChange('');
          this.inputLength = 20;
        }
        if (this.filterable) this.$refs.input.focus();
        console.log(value, option.value)
      } else {
        this.$emit('input', option.value);
        this.emitChange(option.value);
        this.visible = false;
      }
      this.isSilentBlur = byClick;
      this.setSoftFocus();
      // if (this.visible) return;
      // this.$nextTick(() => {
      //   this.scrollToOption(option);
      // });
    },
    valChange(val, oldVal) {
      console.log('valChange')
      if (this.multiple) {
        this.resetInputHeight();
        if ((val && val.length > 0) || (this.$refs.input && this.query !== '')) {
          this.currentPlaceholder = '';
        } else {
          this.currentPlaceholder = this.cachedPlaceHolder;
        }
        if (this.filterable && !this.reserveKeyword) {
          this.query = '';
          this.handleQueryChange(this.query);
        }
      }
      this.setSelected();
      if (this.filterable && !this.multiple) {
        this.inputLength = 20;
      }
    },
    setSoftFocus() {
      this.softFocus = true;
      const input = this.$refs.input || this.$refs.reference;
      if (input) {
        input.focus();
      }
    },
    getValueIndex(arr = [], value) {
      if (this._typeOf(value) != 'object') {
        return arr.indexOf(value);
      } else {
        const valueKey = this.valueKey;
        let index = -1;
        arr.some((item, i) => {
          if (this._getValueByPath(item, valueKey) === this._getValueByPath(value, valueKey)) {
            index = i;
            return true;
          }
          return false;
        });
        return index;
      }
    },
    toggleMenu() {
      if (!this.selectDisabled) {
        if (this.menuVisibleOnFocus) {
          this.menuVisibleOnFocus = false;
        } else {
          this.visible = !this.visible;
        }
        if (this.visible) {
          (this.$refs.input || this.$refs.reference).focus();
        }
      }
    },
    selectOption() {
      console.log('selectOption')
      if (!this.visible) {
        this.toggleMenu();
      } else {
        if (this.options[this.hoverIndex]) {
          this.handleOptionSelect(this.options[this.hoverIndex]);
        }
      }
    },
    deleteSelected(event) {
      event.stopPropagation();
      const value = this.multiple ? [] : '';
      this.$emit('input', value);
      this.emitChange(value);
      this.visible = false;
      this.$emit('clear');
    },
    deleteTag(event, tag) {
      let index = this.selected.indexOf(tag);
      if (index > -1 && !this.selectDisabled) {
        const value = this.value.slice();
        value.splice(index, 1);
        this.$emit('input', value);
        this.emitChange(value);
        this.$emit('remove-tag', tag.value);
      }
      event.stopPropagation();
    },
    onInputChange() {
      console.log('onInputChange')
      if (this.filterable && this.query !== this.selectedLabel) {
        this.query = this.selectedLabel;
        this.handleQueryChange(this.query);
      }
    },
    onOptionDestroy(index) {
      if (index > -1) {
        this.optionsCount--;
        this.filteredOptionsCount--;
        this.options.splice(index, 1);
      }
    },
    resetInputWidth() {
      this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
    },
    handleResize() {
      this.resetInputWidth();
      if (this.multiple) this.resetInputHeight();
    },
    checkDefaultFirstOption() {
      this.hoverIndex = -1;
      // highlight the created option
      let hasCreated = false;
      for (let i = this.options.length - 1; i >= 0; i--) {
        if (this.options[i].created) {
          hasCreated = true;
          this.hoverIndex = i;
          break;
        }
      }
      if (hasCreated) return;
      for (let i = 0; i !== this.options.length; ++i) {
        const option = this.options[i];
        if (this.query) {
          // highlight first options that passes the filter
          if (!option.disabled && !option.groupDisabled && option.visible) {
            this.hoverIndex = i;
            break;
          }
        } else {
          // highlight currently selected option
          if (option.itemSelected) {
            this.hoverIndex = i;
            break;
          }
        }
      }
    },
    getValueKey(item) {
      if (Object.prototype.toString.call(item.value).toLowerCase() !== '[object object]') {
        return item.value;
      } else {
        return this._getValueByPath(item.value, this.valueKey);
      }
    }
  },
  created() {
    this.cachedPlaceHolder = this.currentPlaceholder = this.placeholder;
    if (this.multiple && !Array.isArray(this.value)) {
      this.$emit('input', []);
    }
    if (!this.multiple && Array.isArray(this.value)) {
      this.$emit('input', '');
    }
    this.$on('handleOptionClick', this.handleOptionSelect);
    this.$on('setSelected', this.setSelected);
  },
  mounted() {
    if (this.multiple && Array.isArray(this.value) && this.value.length > 0) {
      this.currentPlaceholder = '';
    }
    const reference = this.$refs.reference;
    if (reference && reference.$el) {
      const sizeMap = {
        medium: 36,
        small: 32,
        mini: 28
      };
      const input = reference.$el.querySelector('input');
      this.initialInputHeight = input.getBoundingClientRect().height ;
    }
    if (this.multiple) {
      this.resetInputHeight();
    }
    this.$nextTick(() => {
      if (reference && reference.$el) {
        this.inputWidth = reference.$el.getBoundingClientRect().width;
      }
    });
    this.setSelected();
  },
  beforeDestroy() {
    if (this.$el && this.handleResize) removeResizeListener(this.$el, this.handleResize);
  }
}
</script>

<style lang="scss" scoped>
.st-input {
  position: relative;
  font-size: 14px;
  width: 100%;
}
.st-select {
  display: inline-block;
  position: relative;

  &-input {
    border-color: #409eff;
  }
  &-tags {
    position: absolute;
    line-height: normal;
    white-space: normal;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    flex-wrap: wrap;
    
    &-item {
      height: 24px;
      line-height: 22px;
      padding: 0 8px;
      box-sizing: border-box;
      margin: 2px 0 2px 6px;
    }
  }

  &-menu {
    min-width: 240px;
    position: absolute;
    border: 1px solid #e4e7ed; 
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-sizing: border-box;
    margin: 5px 0;   
    padding: 6px 0; 
    
    &-item {
      font-size: 14px;
      padding: 0 20px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #606266;
      height: 34px;
      line-height: 34px;
      box-sizing: border-box;
      cursor: pointer;
    }
  }
}
</style>

