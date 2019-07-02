<template>
  <label class="st-checkbox"
    role="checkbox"
    :class="{
      'is-checked': isChecked
    }"
    :aria-checked="isChecked || 'mixed'">
    <span class="st-checkbox-input" 
      :class="{
        'is-checked': isChecked
      }"
      aria-checked="mixed">
      <span class="st-checkbox-inner"></span>
      <input class="st-checkbox-original" 
        type="checkbox" 
        aria-hidden="true"
        :name="name" 
        :value="label"
        @change="handleChange"/>
    </span>
    <span class="st-checkbox-label">
      {{label}}
    </span>
  </label>
</template>

<script>
export default {
  name: 'XCheckbox',
  compontent: 'XCheckbox',
  props: {
    name: String,
    label: {},
  },
  data() {
    return {
      isChecked: false,
    }
  },
  methods: {
    handleChange() {
      this.isChecked = !this.isChecked
      console.log(this.isChecked)
    }
  }
}
</script>

<style lang="scss" scoped>
  .st-checkbox {
    color: #606266;
    font-weight: 500;
    font-size: 14px;
    position: relative;
    cursor: pointer;
    display: inline-block;
    white-space: nowrap;
    user-select: none;
    margin-right: 30px;

    &-input {
      white-space: nowrap;
      cursor: pointer;
      outline: none;
      display: inline-block;
      line-height: 1;
      position: relative;
      vertical-align: middle;
    }

    &-input+.is-checked {
      color: #409eff;
    }

    &-label {
      display: inline-block;
      padding-left: 10px;
      line-height: 19px;
      font-size: 14px;
    }
    &-inner {
      display: inline-block;
      position: relative;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      background-color: #fff;
      z-index: 1;
      transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    }
    &-inner:after {
      box-sizing: content-box;
      content: "";
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      height: 7px;
      left: 4px;
      position: absolute;
      top: 1px;
      transform: rotate(45deg) scaleY(0);
      width: 3px;
      transition: transform .15s ease-in .05s;
      transform-origin: center;
    }

    &-original {
      opacity: 0;
      outline: none;
      position: absolute;
      margin: 0;
      width: 0;
      height: 0;
      z-index: -1;
    }
  }
  .st-checkbox.is-checked .st-checkbox-inner{
    background-color: #409eff;
    border-color: #409eff;
  }
  .st-checkbox-input.is-checked .st-checkbox-inner:after {
    transform: rotate(45deg) scaleY(1);
  }
</style>
