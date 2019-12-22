<template>
	<form
		class="st-form"
		:class="{'st-form-inline': inline}"
		@submit.prevent="submit"
		@reset.prevent="reset"
	>
		<div v-for="(field, fidx) of fields" :key="fidx" class="st-form-field">
			<label v-show="labelVisible" class="st-form-label">
				<span v-if="field.required" class="st-form-required">*</span>
				<span v-text="field.label"></span>
			</label>
			<div
				class="st-form-input-box"
				:class="{'st-form-input-box-focus': field._st_focus}"
			>
				<component
					:is="coms[field.type]"
					:key="fidx"
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
export default {
	components: {XInput},
	props: {
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
		return {
			fields,
			coms: {
				text: XInput,
				combobox: XCombobox
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
				if(field.list) {
					if(!field.type)
						field.type = 'combobox';
				}

				if(!field.type && field.asyncList){
					field.type = 'combobox';
					if(!field.list)
						field.list = [];
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
				if(field.type=='select')
					field.type = 'combobox';
				
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

				return Object.assign({}, field);
			});
		},
		submit(){},
		reset(){}
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
		height: 100%;
		font-size: 100%;
		line-height: 1;
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
		height: 32px;
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
	}
}
</style>