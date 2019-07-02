<template>
  <form class="st-form">
    <div class="st-form-item" v-for="(item, index) in formConfig" :key="index">
      <div class="st-form-item-label">
        <label>{{item.label}}</label>
      </div>
      <div class="st-form-item-content">
        <x-input v-if="item.type == 'input' || item.type == 'textarea'" 
          :type="item.type" 
          :placeholder="item.placeholder || `请填写${item.label}`" 
          :name="item.name" 
          v-model="item.value">
        </x-input>
        <x-select v-if="item.type == 'select'"  
          v-model="item.value" 
          :options="item.options" 
          multiple
          filterable>
        </x-select>
        <template v-if="item.type == 'checkbox'">
          <x-checkbox 
            v-for="(checkitem, checkindex) in item.options"
            :key="checkindex" 
            :label="checkitem.label">

          </x-checkbox>
        </template>
        <template v-if="item.type == 'radio'">
          <x-radio
            :options="item.options">

          </x-radio>
        </template>
      </div>
    </div>
  </form>
</template>

<script>
import XInput from "./input.vue";
import XSelect from "./select.vue";
import XCheckbox from "./checkbox.vue";
import XRadio from "./radio.vue";

export default {
  name: 'XForm',
  componentName: 'XForm',
  components: {XInput,XSelect,XCheckbox,XRadio},
  provide(){
    return {
      Xform: this
    }
  },
  props: {
    formConfig: Array,
  },
  data() {
    return {

    }
  },
  methods: {

  },
  created() {
    console.log(this.formConfig)
  }
}
</script>

<style lang="scss" scoped>
  .st-form {
    width: 100%;

    &-item {
      margin-bottom: 22px;
      
      &-label {
        width: 80px;
        text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        padding: 0 12px 0 0;
        box-sizing: border-box;
      }

      &-content {
        margin-left: 80px;
        line-height: 40px;
        position: relative;
        font-size: 14px;
      }
    }
  }
</style>
