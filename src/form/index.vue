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
			<div
				class="st-form-input-box"
				:class="{'st-form-input-box-focus': field._st_focus}"
				:style="[field.style]"
			>
				<component
					:is="coms[field.type]"
					:key="fidx"
					v-model="formData[field.name]"
					:field="field"
					@fieldfocus="field._st_focus=true"
					@fieldblur="field._st_focus=false"
				/>
			</div>
		</div>
		<slot></slot>
	</form>
</template>

<script>
import {$type} from '../util/util';
import XInput from './Input.vue';
import XCombobox from './Combobox.vue';
import XMultiple from './Multiple.vue';
import XFile from './File.vue';
export default {
	components: {XInput},
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
		let fields = this.format(this.fieldList);
		let formData = {};
		fields.forEach(f=>{
			formData[f.name] = f.value;
		});
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
				combobox: XCombobox,
				cascader: XCombobox,
				multiple: XMultiple,
				file: XFile
			}
		};
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
			return fieldList.map(field=>{
				if($type(field) == 'string')
					field = {
						label: field,
						name: field
					};
				//默认值，向后兼容
				if (typeof field.default_val != 'undefined') {
					field.value = field.default_val;
				}
				if (typeof field.default_value != 'undefined') {
					field.value = field.default_value;
				}
				if(typeof field.value=='undefined')
					field.value = '';
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

				if(field.type=='number') {
					if(!field.pattern)
						field.pattern = '-?[\\d\\.]+';
					if(!field.title) {
						field.title = this.locale.numberMsg;
					}
					field.type = 'text';
				}
				
				if(!field.rules)
					field.rules = [];
				if(field.required) {
					field.rules.push({
						required: true,
						message: '请填写此字段'
					});
				}
				field.rules.forEach(rule=>{
					if(typeof rule.type=='undefined') {
						rule.type='string';
					}
					if(!rule.trigger){
						rule.trigger='blur';
					}
					
				});

				field._st_focus = false;
				if($type(field.width)=='number') {
					field.width = field.width+'px';
				} else if($type(field.width)=='string' && /^\d+$/.test(field.width.trim())){
					field.width = field.width.trim()+'px';
				}
				if(field.width){
					field.style = Object.assign({}, field.style, {width: field.width});
				}
				let ret = Object.assign({}, field);
				if(!ret.placeholder){
					ret.placeholder = ret.label;
				}
				return ret;
			});
		},
		submit(){
			this.$emit('submit', this.formData);
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

	&-inline{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;

		& .st-form-input-box{
			width: 200px;
		}
	}

	&-v{
		& .st-form-input-box{
			width: 300px;
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
}
</style>