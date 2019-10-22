<template>
	<form
		class="st-form" 
		:class="{'st-form-inline': inline}" 
		@submit.prevent="submit"
		@reset="reset()"
	>
		<div 
			v-for="(item, index) in fields" 
			:key="index"
			class="st-form-item"
			:class="sizeCls"
		>
			<div 
				v-if="labelVisible" 
				class="st-form-item-label" 
				:style="{'min-width': !inline ? labelWidth + 'px' : 'auto'}" 
				:class="{'st-form-item-label-left': inline}"
			>
				<label v-text="item.label"></label>
			</div>
			<div class="st-form-item-content">
				<x-input
					v-if="item.type == 'text' || item.type == 'input' || item.type == 'textarea' || (!item.type && !item.list && !item.options)" 
					v-model="formValue[item.name]"
					:type="item.type" 
					:placeholder="item.placeholder || locale.inputMsg + item.label" 
					:name="item.name || item.label"
					@input="changeFn($event,item.name)"
					@validate="fieldListFn($event,item.name)"
				/>
				<x-select
					v-if="['select','combobox','multiple'].includes(item.type) || (!item.type && ((item.list && item.list.length > 0) || (item.options && item.options.length > 0)))" 
					ref="select" 
					v-model="item.value" 
					:default-value="getDef(item)"
					:options="item.options || item.list" 
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
							:name="item.name"
							:format="item.type == 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'"
							@input="dateChangeFn($event, item.name)"
						/>
					</div>
				</template>
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
var defaultLocale = require('../../src/lang/en.js');
import qtip from '../com/qtip';
import {$type,Console} from '../util/util';

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
			type: [Array,Object],
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
		defaultValue: {
			type: [Array,Object,String],
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
		},
		labelWidth: {
			type: Number,
			default: 80
		}
	},
	inject: {
		locale: {
			default: defaultLocale
		}
	},
	provide(){
		return {
			ajax: this.ajax
		};
	},
	data() {
		let fields = this.formatField(this.fieldList ? this.fieldList : this.formConfig.fieldList);
		Console.log(fields);
		if (fields && fields.length > 0) {
			this.formConfig.fieldList = this.fields;
		} else {
			let getParam = this.formConfig.getConfig;
			let data = getParam ? getParam.data : {};
			return this.ajax.request({url: getParam.url, data, method: getParam.read}).then(res=>{
				if(res.errno==0 || res.code==0) {
					fields = res.data;
				} else {
					qtip.error(res.msg);
				}
			});
		}
		this.ajax = new Ajax(Object.assign({}, (window.STable && window.STable.default||{}).ajaxSetting, this.ajaxSetting));
		let formSizeCls = {
			small: 'st-form-small',
			medium: 'st-form-medium',
			large: 'st-form-large'
		};
		return {
			fields,
			formValue: {},
			checkedValue: [],
			showErr: false,
			errMsg: '',
			sizeCls: formSizeCls[this.size]
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
		getDef(item){
			// Console.log(item.defaultValue || item.default_value || item.default_val || item.value);
			return item.defaultValue || item.default_value || item.default_val || item.value;
		},
		formatField(fieldArr) {
			let arr = [];
			for (let key in fieldArr) {
				let item = fieldArr[key];
				item.name = key;
				// ['select','combobox','multiple'].includes(item.type)
				
				if (!item.list && !item.options) {
					arr.push(item);
				} else {
					let tmpList = item.options ? item.options : item.list;
					if($type(tmpList) =='object'){
						let tmp_opt = [];
						for(let key in tmpList) {
							tmp_opt.push({
								label: tmpList[key],
								value: key
							});
						}
						tmpList = tmp_opt;
					}
					if ($type(tmpList) == 'array' || tmpList.length > 0) {
						let tmp_opt = [];
						tmpList.map(item=>{
							if ($type(item) != 'object') {
								tmp_opt.push({
									label: item,
									value: item
								});
							} else if ($type(item) == 'object'){
								tmp_opt.push(item);
							}
						});
						tmpList = tmp_opt;
					}
					item.list = tmpList;
					arr.push(item);
				}
			}
			fieldArr = arr;
			return fieldArr;
		},
		getFormData(){
			return this.formValue;
		},
		getFormList() {
			let tmpArr = {};
			for (let item of this.fields) {
				if(typeof item != 'object')
					item = {name:item};

				if(typeof item.value=='undefined')
					item.value = '';
				if(!item.label)
					item.label = item.name;
				if(!item.placeholder)
					item.placeholder = item.label;
				if(item.type != 'button')
					tmpArr[item.name] = typeof this.defaultValue[item.name]=='undefined' ? item.value || '' : this.defaultValue[item.name];
				if(item.type == 'date') {
					tmpArr[item.name] = this.timeFormat(new Date(),'YYYY-MM-DD');
				}
				if (item.type == 'checkbox') {
					for (const cbx of item.options) {
						if (cbx.ischecked == true)
							this.checkedValue.push(cbx.value);
						tmpArr[item.name] = this.checkedValue;
					}
				}
			}
			this.formValue = tmpArr;
		},
		submit() {
			let data = this.formValue;
			this.$emit('submit', data);
		},
		changeFn(val='',name) {
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
			this.formValue[name] = this.checkedValue;
		},
		dateChangeFn(val,name){
			let realDate = this.timeFormat(val,'YYYY-MM-DD');
			Console.log(name);
			this.changeFn(realDate,name);
		},
		fieldListFn(val,name) {
			let fieldlist = this.rules;
			if (fieldlist[name] && fieldlist[name].validator && typeof fieldlist[name].validator == 'function') {
				//callback 执行
				let callback = (param)=>{
					this.errMsg = param;
				};
				fieldlist[name].validator(fieldlist[name], val, callback);
			}
		},
		reset(){
			let tmpFields = this.fields;
			if (this.fields && tmpFields.length > 0) {
				for (const item of this.fields) {
					if (['select','combobox','multiple'].includes(item.type) || (!item.type && ((item.list && item.list.length > 0) || (item.options && item.options.length > 0)))) {
						item.value = item.defaultValue ? item.defaultValue : [];
					}
				}
			}
			this.fields = tmpFields;
			this.$refs.select.map(item=>{
				item.reset();
			});
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
		&-small {
			font-size: 8px;
		}
		&-medium {
			font-size: 9px;
		}
		&-large {
			font-size: 10px;
		}

    &-item {
			margin-bottom: 6px;
			margin-right: 10px;
      
      &-label {
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
				display: flex;
        line-height: 32px;
        position: relative;
				font-size: 1.4em;
				color: #666;
				
				>input {
					height: 32px;
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
