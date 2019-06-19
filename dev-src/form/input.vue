<template>
  <div
      @mouseenter="hovering = true"
      @mouseleave="hovering = false">
    <template v-if="type != 'textarea'">
      <div class="st-input-wrap" >
        <input 
          class="st-input-wrap-item"
          ref="input"
          v-bind="$attrs"
          :class="[{'st-input-wrap-disabled': disabled}]"
          :type="showPassword ? 'password' : type"
          :disabled="disabled"
          :placeholder="placeholder"
          :readonly="readonly"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"/>
          <!-- 后置元素 -->
          <i v-show="showClear"
              class="st-iconfont st-icon-close st-input-wrap-clear"
              @click="clear"
            ></i>
      </div>
    </template>
    <template v-if="type == 'textarea'">
      <div class="st-textarea-wrap">
        <textarea class="st-textarea-wrap-con"
                :class="[{'st-textarea-wrap-exceed':inputExceed}]"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
                ref="textarea"
                v-bind="$attrs"
                :disabled="disabled"
                :placeholder="placeholder"
                :readonly="readonly">
        
        </textarea>
        <span v-if="isWordLimitVisible && type === 'textarea'" class="st-textarea-wrap-count">{{ textLength }}/{{ upperLimit }}</span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'XInput',
  componentName: 'XInput',
  data(){
    return {
      focused: false,
      hovering: false,
    }
  },
  inject:{},
  props: {
    value: [String,Number],
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    placeholder:{
      type: String,
      default: ''
    },
    length: {
      type: Number,
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },

  },
  watch:{
    value(val) {
      
    },
    nativeInputValue() {
      this.setNativeInputValue();
    },
    type() {
      this.$nextTick(() => {
        this.setNativeInputValue();
      });
    }
  },
  computed: {
    showClear() {
      return this.clearable && 
        !this.disabled &&
        !this.readonly &&
        this.nativeInputValue &&
        (this.focused || this.hovering);
    },
    nativeInputValue() {
      return this.value === null || this.value === undefined ? '' : String(this.value);
    },
    isWordLimitVisible() {
      return this.showWordLimit &&
        this.$attrs.maxlength &&
        (this.type === 'text' || this.type === 'textarea') &&
        !this.disabled &&
        !this.readonly &&
        !this.showPassword;
    },
    upperLimit() {
      return this.$attrs.maxlength;
    },
    textLength() {
      if (typeof this.value === 'number') {
        return String(this.value).length;
      }
      return (this.value || '').length;
    },
    inputExceed() {
      return this.isWordLimitVisible &&
        (this.textLength > this.upperLimit);
    }
  },
  mounted(){
    this.setNativeInputValue();
  },
  methods: {
    setNativeInputValue() {
      const input = this.getInput();
      if (!input) return;
      if (input.value === this.nativeInputValue) return;
      input.value = this.nativeInputValue;
    },
    focus() {
      this.getInput().focus();
    },
    blur() {
      this.getInput().blur();
    },
    handleFocus(event) {
      this.focused = true;
      this.$emit('focus', event);
    },
    handleBlur(event) {
      this.focused = false;
      this.$emit('blur', event);
    },
    handleInput(event) {
      if (event.target.value === this.nativeInputValue) return;
      this.$emit('input', event.target.value);
      this.$nextTick(this.setNativeInputValue);
    },
    handleChange(event) {
      this.$emit('change', event.target.value);
    },
    clear(){
      this.$emit('input', '');
      this.$emit('change', '');
      this.$emit('clear');
    },
    getInput() {
      return this.$refs.input || this.$refs.textarea;
    },
  },
}
</script>


<style lang='scss' scoped>
.st-input-wrap {
  width: 100%;
  display: flex;

  &-item {
    width: 220px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #dcdfe6;
    font-size: inherit;
    padding: 0 15px;
    outline: none;
    text-align: left; 
    border-radius: 4px;
    position: relative;
  }

  &-disabled {
    background: #f5f7fa;
    border-color: #e4e7ed;
    color: #c0c4cc;
    cursor: not-allowed;
  }
  &-clear  {
    position: relative;
    right: 10px;
    width: 20px;
    height: 20px;
    transform: translate(0, 50%);
    right: 20px;
    top: 50%;
  }
  
}
.st-textarea-wrap {
  position: relative;

  &-con {
    width: 100%;
    min-height: 80px;
    text-align: left; 
    padding: 0 15px;
    outline: none;
    font-size: inherit;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
  }

  &-exceed{
    background: #fef0f0;
    border-color: #fbc4c4;
  }

  &-count {
    // color: #f56c6c;
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
</style>

