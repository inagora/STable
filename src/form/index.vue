<template>
	<form
		class="st-form"
		:class="[inline?'st-form-inline':'st-form-v']"
		@submit.prevent="submit"
		@reset.prevent="reset"
	>
		<div v-for="(field, fidx) of fields" :key="fidx" class="st-form-field">
			<label
				v-show="labelVisible"
				class="st-form-label"
				:style="labelStyle"
			>
				<span v-if="field.required" class="st-form-required">*</span>
				<span v-text="field.label"></span>
			</label>
			<div class="st-form-com">
				<div
					class="st-form-input-box"
					:class="[
						{
							'st-form-input-box-focus': field._st_focus,
							'st-form-input-box-error': field.errmsg
						}, 'st-form-input-box-'+field.type]"
					:style="[field.style]"
					@mouseenter="showErrmsg(field.errmsg, $event)"
					@mouseleave="hideErrmsg"
				>
					<x-file
						v-if="field.type=='file'"
						:key="fidx"
						:ref="'field_'+fidx"
						v-model="formData[field.name]"
						:field="field"
					/>
					<component
						:is="coms[field.type]"
						v-else
						:key="fidx"
						:ref="'field_'+fidx"
						v-model="formData[field.name]"
						:field="field"
						@update:errmsg="updateErrmsg(field, $event)"
						@fieldfocus="field._st_focus=true"
						@fieldblur="field._st_focus=false"
					/>
				</div>
				<div v-if="!inline" class="st-form-msg" v-text="field.errmsg"></div>
			</div>
		</div>
		<slot></slot>
	</form>
</template>

<script>
/**
 * 根据web标准，form的一些特性，这里需要实现
 * 1、disabled的表单项，不能编辑，并且不会提交给服务端；readonly的不能编辑，却可以提交给服务端
 * 2、hidden类型的不能显示
 * 3、响应式，field的每个字段都应该做到响应式，比如 label\name\value\readonly\disabled\readonly\width\placeholder。当然这是form的模拟，做不到100%符合标准
 * 4、接3，如果fieldList不是标准格式，因为会被格式化为标准格式，就无法做到响应式了
 */
import {$type} from '../util/util';
import XInput from './Input.vue';
import XCombobox from './Combobox.vue';
import XMultiple from './Multiple.vue';
import XFile from './File.vue';
export default {
	components: {XInput, XFile},
	props: {
		labelWidth: {
			type: Number,
			default: 150
		},
		fieldList: {
			type: [Array, Object],
			required: true
		},
		labelVisible: {
			type: Boolean,
			default: true
		},
		msgTarget: {
			type: String,
			default: 'under'
		},
		size: {
			type: String,
			default: 'medium'
		},
		inline: {
			type: [Boolean, String],
			default: false
		}
	},
	data(){
		let {fields, formData} = this.format(this.fieldList);
		
		let labelStyle = {};
		if(!this.inline) {
			labelStyle = {width:this.labelWidth+'px'};
		}
		return {
			fields,
			formData,
			labelStyle,
			coms: {
				text: XInput,
				datetime: XInput,
				date: XInput,
				number: XInput,
				combobox: XCombobox,
				cascader: XCombobox,
				multiple: XMultiple,
				file: XFile
			}
		};
	},
	watch: {
		fieldList: {
			deep: true,
			handler(val){
				let {fields} = this.format(val);
				this.fields = fields;
			}
		}
	},
	methods: {
		format(fieldList){
			if(!Array.isArray(fieldList)) {
				let arr = [];
				for (let key in fieldList) {
					let item = fieldList[key];
					if($type(item) == 'string'){
						item = {label: item};
					}
					item.name = key;
					arr.push(item);
				}
				fieldList = arr;
			}

			let formData = {};
			let fields = fieldList.map(field=>{
				if($type(field) == 'string')
					field = {
						label: field,
						name: field
					};

				field = Object.assign({
					errmsg: ''
				}, field);
				//默认值，向后兼容
				let value = '';
				if (typeof field.default_val != 'undefined') {
					value = field.default_val;
				}
				if (typeof field.default_value != 'undefined') {
					value = field.default_value;
				}
				if(typeof field.value!='undefined')
					value = field.value;
				formData[field.name] = value;

				if(!field.label)
					field.label = field.name;
				if(!field.placeholder)
					field.placeholder = field.label;
				if(field.list)
					field.options = field.list;
				if(field.asyncList)
					field.options = field.asyncList;
				if(field.options) {
					if(!field.type)
						field.type = 'combobox';
				}
				if(field.type=='cascader') {
					field.filterable = false;
				}
				if(field.type=='select')
					field.type = 'combobox';
				if(field.type=='combobox'){
					if(typeof field.filterable=='undefined'){
						field.filterable = true;
					}
				}

				if(!field.type){
					if(field.buttons){
						field.type = 'button';
					} else {
						field.type = 'text';
					}
				}

				if(field.type=='file'){
					field.upload = field.upload || field.uploadConfig||{};
					field.loading = false;
				}

				field._st_focus = false;
				if($type(field.width)=='number') {
					field.width = field.width+'px';
				} else if($type(field.width)=='string' && /^\d+$/.test(field.width.trim())){
					field.width = field.width.trim()+'px';
				}
				
				let ftype = $type(field.width);
				if(ftype != 'undefined'){
					let w = field.width;
					if(ftype=='number')
						w += 'px';
					else if(ftype=='string' &&/^[\d.]+$/.test(w.trim())) {
						w += 'px';
					}
					field.style = Object.assign({}, field.style, {width: w});
				}

				field.msg = '';
				//设置检验条件rules
				if(!field.rules)
					field.rules = [];
				field.rules.forEach(rule=>{
					if(!rule.trigger){
						rule.trigger='blur';
					}
				});
				
				return field;
			});

			return {formData, fields};
		},
		submit(){
			if(this.validateAll()){
				this.$emit('submit', this.formData);
			}
		},

		validateAll(){
			/**
			 * 主要用来验证rules下的检验条件是不是通过
			 * 可支持的验证有：
			 * - required，必须有值
			 * - pattern，正则表达式，或者字符串
			 * - number，必须是数字
			 * - min/max，只对数字有效
			 * - length，只对字符串和数组有效
			 * - validator，自定义验证函数，如果返回true，验证通过，如果返回字符串，当做错误提示显示
			 */
			//它调用每个组件的validate函数，一旦有一个不通过，直接返回false
			let ret = true;
			for(let key in this.$refs){
				for(let com of this.$refs[key]) {
					if(!com.validate()){
						ret = false;
					}
				}
			}
			return ret;
		},
		reset(){
			let formData = {};
			this.fields.forEach(f=>{
				formData[f.name] = f.value;
			});
			this.formData = formData;
		},
		getFormData(){
			return this.formData;
		},
		showErrmsg(msg, evt){
			if(!this.inline)
				return;
			if(!this.errFly){
				let el = document.createElement('div');
				el.className = 'st-form-fly-errmsg';
				document.body.appendChild(el);
				this.errFly = el;
			}
			if(!msg){
				this.hideErrmsg();
				return;
			}
			this.errFly.innerHTML = msg;
			this.errFly.style.display = 'block';
			let targetRect = evt.target.getBoundingClientRect();
			let flyRect = this.errFly.getBoundingClientRect();
			let docEl = document.documentElement;
			let left=0;
			let top=0;
			let v = 'b';
			let h = 'l';
			let cls = {
				b: 'st-form-fly-b',
				t: 'st-form-fly-t',
				l: 'st-form-fly-l',
				r: 'st-form-fly-r'
			};
			if(targetRect.bottom+flyRect.height < docEl.clientHeight) {
				top = targetRect.bottom+7;
			} else {
				top = targetRect.top-flyRect.height-7;
				v = 't';
			}

			if(targetRect.left+flyRect.width < docEl.clientWidth) {
				left = targetRect.left;
			} else {
				left = targetRect.right-flyRect.width;
				h = 'r';
			}
			
			this.errFly.style.left = left+'px';
			this.errFly.style.top = top+'px';
			this.errFly.className = 'st-form-fly-errmsg '+cls[v]+' '+cls[h];
		},
		hideErrmsg(){
			if(this.errFly)
				this.errFly.style.display = 'none';
		},
		updateErrmsg(field, msg){
			field.errmsg = msg;
			if(!msg && this.errFly){
				if(this.errFly.style.display=='block')
					this.errFly.style.display = 'none';
			}
		}
	}
};
</script>

<style lang="scss">
.st-form{
	&-item{
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	&-label{
		font-size: 14px;
		color: rgba(0, 0, 0, 0.85);
	}
	&-input{
		box-sizing: border-box;
		height: 30px;
		font-size: 100%;
		line-height: 30px;
		background: transparent;
		border-width: 0;
		border-radius: 4px;
		outline: 0;
		padding: 4px 11px;
		width: 100%;
	}
	&-input-box{
		box-sizing: border-box;
		font-variant: tabular-nums;
		list-style: none;
		font-feature-settings: 'tnum';
		position: relative;
		display: inline-block;
		margin: 0 8px 8px 0;
		color: rgba(0, 0, 0, 0.65);
		font-size: 14px;
		line-height: 1.5;
		background-color: #fff;
		background-image: none;
		border: 1px solid #d9d9d9;
		border-radius: 4px;
		transition: all 0.3s;
	}
	&-input-box:hover{
		border-color: #40a9ff;
	}
	&-input-box-focus{
		border-color: #40a9ff;
		border-right-width: 1px !important;
		outline: 0;
		box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
	}
	&-input-box-error{
		border-color: #ff4d4f;
		border-right-width: 1px !important;
		outline: 0;
	}
	&-input-box-error:hover{
		border-color: #ff4d4f;
		box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
	}
	&-input-box-file{
		border: none;
	}

	&-inline{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;

		& .st-form-input-box{
			width: 200px;
		}
	}
	&-inline &-com{
		display: inline-block;
	}

	&-v{
		.st-form-label{
			padding-top: 5px;
		}
		.st-form-field{
			display: flex;
			align-items: flex-start;
		}
		.st-form-com{
			flex: 1;
		}
		.st-form-input-box{
			width: 100%;
			margin: 0;
		}
	}

	& .st-btn{
		margin-bottom: 8px;
	}

	&-v &-label{
		display: inline-block;
		text-align: right;
		margin-right: 5px;
	}

	&-msg{
		min-height: 18px;
		line-height: 18px;
		font-size: 12px;
		color: #f5222d;
		padding-bottom: 3px;
	}

	&-fly-errmsg{
		position: fixed;
		display: none;
		left: 0;
		top: 0;
		max-width: 61%;
		line-height: 18px;
		font-size: 12px;
		padding: 5px 5px;
		color: #f5222d;
		border: 1px solid rgba(255, 77, 79, 0.8);
		z-index: 100;
		background: #fff7e6;
		border-radius: 3px;
	}
	&-fly-errmsg:after{
		content: '';
		height: 6px;
		width: 6px;
		font-size: 0;
		line-height: 0;
		overflow: hidden;
		border: solid 1px;
		border-color: transparent rgba(255, 77, 79, 0.8) rgba(255, 77, 79, 0.8) transparent;
		position: absolute;
		background-color: #fff7e6;
	}
}

.st-form-fly-l.st-form-fly-b:after{
	transform: rotate(-135deg);
	top: -4px;
	left: 10px;
}
.st-form-fly-r.st-form-fly-b:after{
	transform: rotate(-135deg);
	top: -4px;
	right: 10px;
}
.st-form-fly-l.st-form-fly-t:after{
	transform: rotate(45deg);
	bottom: -4px;
	left: 10px;
}
.st-form-fly-r.st-form-fly-t:after{
	transform: rotate(45deg);
	bottom: -4px;
	right: 10px;
}
</style>