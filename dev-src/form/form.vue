<template>
  <form class="st-form">
    <div class="st-form-item" v-for="(item, index) in formConfig" :key="index">
      <div class="st-form-item-label">
        <label>{{item.label}}</label>
      </div>
      <div class="st-form-item-content">
        <x-input v-if="item.type == 'input' || item.type == 'textarea'" 
          :type="item.type" 
          :placeholder="item.placeholder || `${locale.inputMsg + item.label}`" 
          :name="item.name" 
          v-model="item.value"
					@input="changeFn($event,item.name)"
					@validate="fieldListFn($event,item.name)">
        </x-input>
        <x-select v-if="item.type == 'select'"  
          v-model="item.value" 
          :options="item.options" 
          multiple
          filterable
					@selectchange="changeFn($event,item.name)"
					@validate="fieldListFn($event,item.name)">
        </x-select>
        <template v-if="item.type == 'checkbox'">
          <x-checkbox 
            v-for="(checkitem, checkindex) in item.options"
            :key="checkindex" 
            :label="checkitem.label"
						:value="checkitem.value"
						@change="checkboxFn($event,item.name)">

          </x-checkbox>
        </template>
        <template v-if="item.type == 'radio'">
          <x-radio
            :options="item.options"
						@change="changeFn($event,item.name)"
						@validate="fieldListFn($event,item.name)">

          </x-radio>
        </template>
        <template v-if="item.type == 'switch'">
          <x-switch
						:name="item.name"
						@change="changeFn($event,item.name)">

          </x-switch>
        </template>
				<template v-if="item.type == 'button'">
					<div class="st-form-btn">
						<x-button class="st-form-btn-item" 
							v-for="(btn, btnindex) in item.options" 
							:key="btnindex" 
							:type="btn.theme" 
							@click.prevent="clickFn(btn.handle)">
							{{btn.text}}
						</x-button>
					</div>
				</template>
      </div>
    </div>
		<div class="st-form-tips" v-show="showErr">{{errMsg}}</div>
  </form>
</template>

<script>
import XInput from "./input.vue";
import XSelect from "./select.vue";
import XCheckbox from "./checkbox.vue";
import XRadio from "./radio.vue";
import XSwitch from "./switch.vue";
import XButton from "../com/Button.vue";
import defaultLocale from '../../src/lang/en.js';
import { setTimeout } from 'timers';

export default {
  name: 'XForm',
  componentName: 'XForm',
  components: {XInput,XSelect,XCheckbox,XRadio,XSwitch,XButton},
  provide(){
    return {
      XForm: this
    }
  },
  props: {
		formConfig: Array,
		rules: [Object, Array],
	},
	inject: {
		locale: {
			default: defaultLocale
		}
	},
  data() {
    return {
			formValue: {},
			checkedValue: [],
			showErr: false,
			errMsg: ''
    }
	},
	watch: {
		errMsg: {
			handler(val) {
				if (val != '') {
					this.errMsg = val;
					this.showErr = true;
					setTimeout(()=>{
						this.showErr = false;
					},2000)
				} else {
					this.showErr = false;
				}
			}
		}
	},
  methods: {
		clickFn(handle) {
			if(handle === 'submit') 
			console.log(this.formValue)
		},
		changeFn(val,name) {
			this.formValue = Object.assign(this.formValue,{[name]: val})
		},
		checkboxFn(param,name) {
			let val = param[0];
			let checked = param[1];
			let idx = this.checkedValue.indexOf(val);
			
			if(idx == '-1' && checked) {
				this.checkedValue.push(val) 
			}	else if(idx != '-1' && !checked) {
				this.checkedValue.splice(idx,1)
			}
			this.formValue[name] = this.checkedValue.toString();
			this.fieldListFn(val,name)
		},
		getType(target) {
			if (this.formConfig[target] && this.formConfig[target].type) {
				return this.formConfig[target].type
			}
		},
		fieldListFn(val,name) {
			let fieldlist = this.rules;
			const placeholder = name == 'select' || 'checkbox' ? this.locale.chooseMsg : this.locale.inputMsg;
			// this.errMsg = placeholder + fieldlist[name].label;
		
			if (fieldlist[name] && fieldlist[name].validator && typeof fieldlist[name].validator == 'function') {
				//callback 执行
				let callback = (param)=>{
					this.errMsg = param
				}
				fieldlist[name].validator(fieldlist[name], val, callback)
			}
		},
  },
  created() {
		let tmpArr = {}
		this.formConfig.map(item=>{
			if(item.type != 'button')
			tmpArr[item.name] = item.value || ''
		})
		this.formValue = tmpArr;
  }
}
</script>

<style lang="scss" scoped>
  .st-form {
    width: 100%;
		position: relative;

    &-item {
      margin-bottom: 22px;
      
      &-label {
        min-width: 80px;
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
        margin-left: 100px;
        line-height: 40px;
        position: relative;
        font-size: 14px;
      }
    }
		&-btn {
			display: flex;
			justify-content: center;

			&-item {
				margin: 0 10px;
			}
		}

		&-tips {
			width: 400px;
			height: 60px;
			padding: 8px 16px;
			background: #fef0f0;
			box-sizing: border-box;
    	border-radius: 4px;
			color: #f56c6c;
			text-align: center;
			position: absolute;
			display: flex;
			align-items: center;
			justify-content: center;
			left: 50%;
			top: 50%;
			transform: translate(-50%,-50%);
		}
  }
</style>
