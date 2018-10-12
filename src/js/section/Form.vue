<template>
	<el-form v-bind="$attrs" :inline="inline" @submit.native.prevent="submit" :model="formData">
		<el-form-item v-for="field in fields" :key="field.name" :label="field.label">
			<el-input
				v-if="field.type=='text'"
				v-model="formData[field.name]"
				type="text"
				:style="{width:field.width+'px'}"
				:pattern="field.pattern"
				:readonly="field.readonly"
				:required="field.required"
				:placeholder="field.placeholder"
				:title="field.title"
				:name="field.name"></el-input>
			<el-input
				v-else-if="field.type=='textarea'"
				v-model="formData[field.name]"
				type="textarea"
				:style="{width:field.width+'px'}"
				:pattern="field.pattern"
				:readonly="field.readonly"
				:required="field.required"
				:placeholder="field.placeholder"
				:title="field.title"
				:name="field.name"></el-input>
			<el-date-picker
				v-else-if="field.type=='date'||field.type=='datetime'"
				v-model="formData[field.name]"
				:type="field.type"
				:style="{width:field.width+'px'}"
				:value-format="field.type=='date'?'yyyy-MM-dd':'yyyy-MM-dd HH:mm:ss'"
				:readonly="field.readonly"
				:required="field.required"
				:placeholder="field.placeholder"
				:title="field.title"
				:name="field.name"></el-date-picker>
			<el-time-picker
				v-else-if="field.type=='time'"
				v-model="formData[field.name]"
				value-format="HH:mm:ss"
				:style="{width:field.width+'px'}"
				:readonly="field.readonly"
				:required="field.required"
				:placeholder="field.placeholder"
				:title="field.title"
				:name="field.name"></el-time-picker>
			<el-select
				v-else-if="field.type=='combobox'||field.type=='multiple'"
				v-model="formData[field.name]"
				filterable
				clearable
				:default-first-option="true"
				:filter-method="field.filter"
				:style="{width:field.width+'px'}"
				:multiple="field.type=='multiple'"
				:readonly="field.readonly"
				:required="field.required"
				:placeholder="field.placeholder"
				:title="field.title"
				:name="field.name">
				<el-option
					v-for="item in field._list"
					:key="item.value"
					:label="item.text"
					:value="item.value">
				</el-option>
			</el-select>
			<x-file
				v-else-if="field.type=='file'"
				:val.sync="formData[field.name]"
				:field-conf="field"
				:loading.sync="field.loading"
				:required="field.required"
				:placeholder="field.placeholder"
				:title="field.title"
				:name="field.name">
			</x-file>
		</el-form-item>
		<slot></slot>
	</el-form>
</template>
<script>
	import {Message} from 'element-ui';
	import XFile from './File.vue';
	const py = require('../pinyin/web-pinyin');
	window.py = py;
	export default {
		props: {
			fieldList:Array,
			actionMethods: {
				default: {
					read: 'GET'
				}
			},
			defaultValues: {
				default: {}
			},
			inline: {
				default: false
			}
		},
		components: {XFile},
		data(){
			let fields = this.formatField(this.fieldList);
			let formData = {};
			fields.forEach((field, idx)=>{
				formData[field.name] = typeof this.defaultValues[field.name]=='undefined' ? field.value : this.defaultValues[field.name];

				if(field.type=='combobox'||field.type=="multiple") {
					function joinText(arr){
						return arr.map(item=>item[0]).join('');
					}
					field.list.forEach(item=>{
						let text = item.text.toLocaleLowerCase();
						item._s = text
							+ '_' + joinText(py(text, {style:py.STYLE_NORMAL}))
							+ '_' + joinText(py(text, {style:py.STYLE_INITIALS}))
							+ '_' + joinText(py(text, {style:py.STYLE_FIRST_LETTER}));
					});
					field._list = field.list;
					field.filter = (q)=>{
						this.filter(q, idx);
					};
				}
			});
			
			this.$nextTick(()=>{
				this.getAsyncList(this.actionMethods);
			});
			return {
				fields,
				formData
			}
		},
		methods: {
			filter(q, idx){
				q = q.toLocaleLowerCase();
				let field = this.fields[idx];
				let list = field.list.filter(item=>{
					return item._s.includes(q);
				});
				field._list = list;
			},
			formatField(fieldArr) {
				if (!Array.isArray(fieldArr)) {
					let arr = [];
					for (let key in fieldArr) {
						let item = fieldArr[key];
						if(typeof item != 'object'){
							item = {label: item};
						}
						item.name = key;
						arr.push(item);
					}
					fieldArr = arr;
				}

				fieldArr = fieldArr.map(field=>{
					if(typeof field != 'object')
						field = {name:field};
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
						if(!Array.isArray(field.list)) {
							let list = [];
							for(let name in field.list) {
								list.push({
									text: field.list[name],
									value: name
								});
							}
							field.list = list;
						} else {
							field.list = field.list.map(item=>{
								if(typeof item != 'object') {
									return {
										text: item,
										value: item
									};
								}
								return item;
							});
						}
						if(!field.type)
							field.type = 'combobox';
					}

					if(!field.type && field.asyncList){
						field.type = 'combobox';
						if(!field.list)
							field.list = [];
					}
			
					if(!field.type)
						field.type = 'text';
					if(field.type=='number') {
						if(!field.pattern)
							field.pattern = '-?[\\d\\.]+';
						if(!field.title) {
							field.title = '请输入一个数字';
						}
						field.type = 'text';
					}
					if(field.type=='select')
						field.type = 'combobox';
					if(this.inline){
						switch(field.type) {
							case 'text':
								field.width = field.width||120;
								break;
							case 'date':
								field.width = field.width||150;
								break;
							case 'time':
								field.width = field.width||150;
								break;
							case 'datetime':
								field.width = field.width||200;
								break;
						}
					}
					if(field.type=='file')
						field.loading = false;

					return Object.assign({}, field);
				});

				return fieldArr;
			},
			getAsyncList(actionMethods) {
				this.fields.forEach(field=>{
					if(['combobox','multiple'].includes(field.type) && field.asyncList) {
						if(typeof field.asyncList == 'string') {
							field.list = [];
							$fetch(field.asyncList, null, actionMethods.read).then(res=>{
								if(res.errno==0 || res.code==0) {
									field.list = res.data.list;
								} else {
									Message.error(res.errmsg||res.msg);
								}
							});
						} else {
							field.asyncList().then(list=>{
								field.list = list;
							});
						}
					}
				});
			},
			submit(){
				for(let field of this.fields){
					if(field.type=='file' && field.loading) {
						Message({
							message: '文件上传中，请稍等...',
							type: 'info'
						});
						break;
					}
				}
				
				this.$emit('submit', this.formData);
			},
			getFormData(){
				return this.formData;
			}
		}
	}
</script>