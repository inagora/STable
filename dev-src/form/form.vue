<template>
	<form
		class="st-form" 
		:class="{'st-form-inline': inline}" 
		@submit.prevent="submit"
		@reset="resetFields"
	>
		<div 
			v-for="(item, index) in formConfig.fieldList || fieldList" 
			:key="index"
			class="st-form-item"
			:class="size"
		>
			<div v-if="labelVisible" class="st-form-item-label" :class="{'st-form-item-label-left': inline}">
				<label v-text="item.label"></label>
			</div>
			<div class="st-form-item-content">
				<x-input
					v-if="item.type == 'text' || item.type == 'input' || item.type == 'textarea' || !item.type" 
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
						:checked="checkitem.ischecked"
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
				<template>
					<div v-if="['date','time','datetime'].includes(item.type)">
						<x-datetime-picker
							:value="time"
							:name="item.name"
							:format="item.type == 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'"
							@input="dateChangeFn($event, item.name)"
						/>
					</div>
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
import Ajax from '../util/Ajax';
import XInput from "./input.vue";
import XSelect from "./select.vue";
import XCheckbox from "./checkbox.vue";
import XRadio from "./radio.vue";
import XSwitch from "./switch.vue";
import XUpload from "./upload.vue";
import XDatetimePicker from "./datetimepicker.vue";
// import XButton from "../com/Button.vue";
import defaultLocale from '../../src/lang/en.js';
import qtip from '../com/qtip';
import {Console} from "../util/util.js";

export default {
	name: 'XForm',
	componentName: 'XForm',
	components: {XInput,XSelect,XCheckbox,XRadio,XSwitch,XUpload,XDatetimePicker},
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
		},
		size: {
			type: String,
			default: 'medium'
		},
		ajaxSetting: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	inject: {
		locale: {
			default: defaultLocale
		}
	},
	provide(){
		Console.log('provide');
		return {
			ajax: this.ajax
		};
	},
	data() {
		this.ajax = new Ajax(Object.assign({}, (window.STable && window.STable.default||{}).ajaxSetting, this.ajaxSetting));
		return {
			formValue: {},
			checkedValue: [],
			showErr: false,
			errMsg: '',
			dataRange: [],
			time: new Date(),
		};
	},
	computed: {
		syncTime(){
			return new Date();
		}
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
		Console.log('mounted');
		this.getFormList();
	},
	methods: {
		getFormList() {
			if (this.fieldList && this.fieldList.length > 0) {
				this.formConfig.fieldList = this.fieldList;
			} else {
				let getParam = this.formConfig.getConfig;
				let data = getParam ? getParam.data : {};
				return this.ajax.request({url: getParam.url, data, method: getParam.read}).then(res=>{
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
				if(item.type == 'date') {
					this.dataRange.push(item);
				}
				if (item.type == 'checkbox') {
					for (const cbx of item.options) {
						if (cbx.ischecked == true)
							this.checkedValue.push(cbx.value);
						tmpArr[item.name] = this.checkedValue.toString();
					}
				}
			}
			this.formValue = tmpArr;
		},
		submit() {
			let data = this.formValue;
			Console.log(data);
			this.$emit('submit', data);
		},
		changeFn(val,name) {
			Console.log(val);
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
		dateChangeFn(val,name){
			let realDate = this.timeFormat(val,'YYYY-MM-DD');
			this.changeFn(realDate,name);
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
		timeFormat (time, format) {
			const year = time.getFullYear();
			const month = time.getMonth();
			const day = time.getDate();
			const hours24 = time.getHours();
			const hours = hours24 % 12 === 0 ? 12 : hours24 % 12;
			const minutes = time.getMinutes();
			const seconds = time.getSeconds();
			const milliseconds = time.getMilliseconds();
			const dd = t => ('0' + t).slice(-2);
			const map = {
				YYYY: year,
				MM: dd(month + 1),
				M: month + 1,
				DD: dd(day),
				D: day,
				HH: dd(hours24),
				H: hours24,
				hh: dd(hours),
				h: hours,
				mm: dd(minutes),
				m: minutes,
				ss: dd(seconds),
				s: seconds,
				S: milliseconds
			};
			return format.replace(/Y+|M+|D+|H+|h+|m+|s+|S+/g, str => map[str]);
		},
	}
};
</script>

<style lang="scss" scoped>
  .st-form {
    width: 100%;
		position: relative;
		.small {
			font-size: 8px;
		}
		.medium {
			font-size: 9px;
		}
		.large {
			font-size: 10px;
		}

    &-item {
			margin-bottom: 6px;
			margin-right: 10px;
      
      &-label {
        // min-width: 80px;
        text-align: right;
        vertical-align: middle;
        float: left;
        font-size: 1.4em;
        color: #606266;
        line-height: 3em;
        padding: 0 1.2em 0 0;
				box-sizing: border-box;

				&-left {
					text-align: left;
				}
      }

      &-content {
				// margin-left: 100px;
				display: flex;
        line-height: 3em;
        position: relative;
				font-size: 1.4em;
				color: #666;
				
				>input {
					height: 3em;
				}
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
			flex-wrap: wrap;
			flex-direction: row;
			margin-left: 0;
		}
  }
</style>
