<template>
	<form
		class="st-form" 
		:class="{'st-form-inline': inline}" 
		@submit="submit()"
		@reset="resetFields"
	>
		<div 
			v-for="(item, index) in formConfig.fieldList || fieldList" 
			:key="index" 
			class="st-form-item"
		>
			<div v-if="labelVisible" class="st-form-item-label">
				<label v-text="item.label"></label>
			</div>
			<div class="st-form-item-content">
				<x-input
					v-if="item.type == 'input' || item.type == 'textarea'" 
					v-model="formValue[item.name]" 
					:type="item.type" 
					:placeholder="item.placeholder || locale.inputMsg + item.label" 
					:name="item.name"
					@input="changeFn($event,item.name)"
					@validate="fieldListFn($event,item.name)"
				/>
				<x-select
					v-if="['select','combobox','multiple'].includes(item.type)"  
					v-model="item.value" 
					:options="item.options" 
					:multiple="item.type == 'multiple'"
					:filterable="item.type == 'multiple'"
					@selectchange="changeFn($event,item.name)"
					@validate="fieldListFn($event,item.name)"
				/>
				<template v-if="item.type == 'checkbox'">
					<x-checkbox 
						v-for="(checkitem, checkindex) in item.options"
						:key="checkindex" 
						:label="checkitem.label"
						:value="checkitem.value"
						@change="checkboxFn($event,item.name)"
					/>
				</template>
				<template v-if="item.type == 'radio'">
					<x-radio
						:options="item.options"
						@change="changeFn($event,item.name)"
						@validate="fieldListFn($event,item.name)"
					/>
				</template>
				<template v-if="item.type == 'switch'">
					<x-switch
						:name="item.name"
						@change="changeFn($event,item.name)"
					/>
				</template>
				<template v-if="item.type == 'file'">
					<x-upload 
						:mode="item.mode"
						:name="item.name"
						:action="item.action"
					/>
				</template>
				<!-- <template v-if="item.type == 'button'">
					<div class="st-form-btn">
						<x-button
							v-for="(btn, btnindex) in item.options" 
							:key="btnindex" 
							class="st-form-btn-item" 
							:type="btn.theme" 
							@click.prevent="submit(btn)"
						>
							{{ btn.text }}
						</x-button>
					</div>
				</template> -->
			</div>
		</div>
		<slot></slot>
		<div v-show="showErr" class="st-form-tips" v-text="errMsg"></div>
	</form>
</template>

<script>
import {ajax} from '../util/ajax';
import XInput from "./input.vue";
import XSelect from "./select.vue";
import XCheckbox from "./checkbox.vue";
import XRadio from "./radio.vue";
import XSwitch from "./switch.vue";
import XUpload from "./upload.vue";
// import XButton from "../com/Button.vue";
import defaultLocale from '../../src/lang/en.js';
import qtip from '../com/qtip';
import {Console} from "../util/util.js";

export default {
	name: 'XForm',
	componentName: 'XForm',
	components: {XInput,XSelect,XCheckbox,XRadio,XSwitch,XUpload},
	props: {
		formConfig: {
			type: Object,
			default() {
				return {};
			}
		},
		rules: {
			type: [Object, Array],
			default() {
				return {};
			}
		},
		fieldList: {
			type: [Array],
			default() {
				return [];
			}
		},
		actionMethods: {
			type: Object,
			default() {
				return  {
					read: "GET"
				};
			}
		},
		defaultValues: {
			type: [Array,Boolean],
			default() {
				return [];
			}
		},
		inline: {
			type: Boolean,
			default: false
		},
		labelVisible: {
			type: Boolean,
			default: true
		}
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
			errMsg: '',
		};
	},
	watch: {
		errMsg(val) {
			if (val != '') {
				this.errMsg = val;
				this.showErr = true;
				setTimeout(()=>{
					this.showErr = false;
				},2000);
			} else {
				this.showErr = false;
			}
		}
	},
	mounted() {
		this.getFormList();
	},
	methods: {
		getFormList() {
			if (this.fieldList && this.fieldList.length > 0) {
				this.formConfig.fieldList = this.fieldList;
			} else {
				let getParam = this.formConfig.getConfig;
				let data = getParam ? getParam.data : {};
				return ajax({url: getParam.url, data, type: getParam.read}).then(res=>{
					res = res[0];
					if(res.errno==0 || res.code==0) {
						this.formConfig.fieldList = res.data;
					} else {
						qtip.error(res.msg);
					}
				});
			}
			let tmpArr = {};
			for (const item of this.formConfig.fieldList) {
				if(item.type != 'button')
					tmpArr[item.name] = item.value || '';
			}
			this.formValue = tmpArr;
		},
		submit() {
			Console.log('submit');
			let data = this.formValue;
			this.$emit('submit', data);
		},
		changeFn(val,name) {
			this.formValue = Object.assign(this.formValue,{[name]: val});
		},
		checkboxFn(param,name) {
			let val = param[0];
			let checked = param[1];
			let idx = this.checkedValue.indexOf(val);
			
			if(idx == '-1' && checked) {
				this.checkedValue.push(val); 
			}	else if(idx != '-1' && !checked) {
				this.checkedValue.splice(idx,1);
			}
			this.formValue[name] = this.checkedValue.toString();
		},
		getType(target) {
			if (this.formConfig[target] && this.formConfig[target].type) {
				return this.formConfig[target].type;
			}
		},
		fieldListFn(val,name) {
			let fieldlist = this.rules;
			// const placeholder = name == 'select' || 'checkbox' ? this.locale.chooseMsg : this.locale.inputMsg;
		
			if (fieldlist[name] && fieldlist[name].validator && typeof fieldlist[name].validator == 'function') {
				//callback 执行
				let callback = (param)=>{
					this.errMsg = param;
				};
				fieldlist[name].validator(fieldlist[name], val, callback);
			}
		},
		resetFields(fields){
			// this.$refs.form.reset();
			let tmpFields = fields.split(',');
			if (tmpFields && tmpFields.length > 0) {
				for (const item of tmpFields) {
					this.formValue[item] = '';
				}
			}
			
		},
	}
};
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

		&-inline {
			display: flex;
			flex-direction: row;
			margin-left: 0;
		}
  }
</style>
