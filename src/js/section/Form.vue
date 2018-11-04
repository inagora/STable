<template>
	<el-form v-bind="$attrs" :inline="inline" @submit.native.prevent="submit" :model="formData">
		<template v-for="field in fields">
			<input
				v-if="field.type=='hidden'"
				type="hidden"
				:key="field.name"
				v-model="formData[field.name]"
				:name="field.name" />
			<el-form-item v-else :key="field.name" :label="field.label">
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
					v-else-if="dateTypes.includes(field.type)"
					v-model="formData[field.name]"
					:type="field.type"
					:style="{width:field.width+'px'}"
					:value-format="field.format||dateFormat[field.type]"
					:readonly="field.readonly"
					:required="field.required"
					:placeholder="field.placeholder"
					:title="field.title"
					:name="field.name"></el-date-picker>
				<el-time-picker
					v-else-if="timeTypes.includes(field.type)"
					v-model="formData[field.name]"
					:value-format="field.format||timeFormat[field.type]"
					:format="field.format||timeFormat[field.type]"
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
				<el-cascader
					v-else-if="field.type=='cascade'"
					v-model="formData[field.name]"
					:options="field.options"
					filterable
					clearable
					:style="{width:field.width+'px'}"
					:readonly="field.readonly"
					:required="field.required"
					:placeholder="field.placeholder"
					:title="field.title"
					:name="field.name"
					@change="handleChange">
				</el-cascader>
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
				<el-row v-else-if="field.type=='button'">
					<el-button
						v-for="(btn,idx) in field.buttons"
						:key="idx"
						:icon="btn.icon"
						:type="btn.type"
						:form="btn.form"
						:native-type="btn.nativeType"
						@click="btnClick(btn, $event)"
						size="small">{{btn.text}}</el-button>
				</el-row>
			</el-form-item>
		</template>
		<slot></slot>
	</el-form>
</template>
<script>
	import {ajax} from '../ajax';
	import XFile from './File.vue';
	import {loadJs} from '../util';
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
					field._list = [];
					if(field.asyncList) {
						this.getAsyncList(field, this.actionMethods).then(()=>{
							this.initSearch(field, idx);
						});
					} else {
						this.initSearch(field, idx);
					}
				} else if (field.type=='cascade') {
					let format = function(list) {
						let options = [];
						list.forEach(item=>{
							let data = {
								value: item[0],
								label: item[1]
							};
							if(item[2] && Array.isArray(item[2])) {
								data.children = format(item[2]);
							}
							options.push(data);
						});
						return options;
					};
					field.options = format(field.listData);
				}
			});
		
			return {
				fields,
				formData,
				dateTypes: ['year', 'month', 'date', 'datetime'],
				dateFormat: {
					year: 'yyyy',
					month: 'yyyy-MM',
					date: 'yyyy-MM-dd',
					datetime: 'yyyy-MM-dd HH:mm:ss'
				},
				timeTypes: ['time', 'minute', 'hour'],
				timeFormat: {
					time: 'HH:mm:ss',
					minute: 'HH:mm',
					hour: 'HH'
				}
			}
		},
		methods: {
			initSearch(field, idx) {
				function joinText(arr){
					return arr.map(item=>item[0]).join('');
				}
				loadJs('https://cdn.jsdelivr.net/gh/inagora/STable/dist/pinyin.min.js').then(()=>{
					let py = window.pinyin;
					field.list.forEach(item=>{
						let text = item.text.toLocaleLowerCase();
						item._s = [
							text,
							joinText(py(text, {style:py.STYLE_FIRST_LETTER})),
							joinText(py(text, {style:py.STYLE_INITIALS})),
							joinText(py(text, {style:py.STYLE_NORMAL}))
						];
					});
					field._list = field.list;

					field.filter = (q)=>{
						this.filter(q, idx);
					};
				});
			},
			filter(q, idx){
				q = q.toLocaleLowerCase();
				let field = this.fields[idx];
				let matchedIndexes = [
					[],[],[],[]
				];
				field.list.forEach((item, index)=>{
					for(let i=0;i<4;i++) {
						if(item._s[i].includes(q)) {
							matchedIndexes[i].push(index);
						}
					}
				});
				let indexes = new Set();
				for(let ml of matchedIndexes) {
					for(let i of ml){
						indexes.add(i);
					}
				}
				let list = [];
				indexes.forEach(i=>{
					list.push(field.list[i]);
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
			getAsyncList(field, actionMethods) {
				return new Promise(resolve=>{
					if(typeof field.asyncList == 'string') {
						field.list = [];
						ajax({url: field.asyncList, type: actionMethods.read}).then(res=>{
							res = res[0];
							if(res.errno==0 || res.code==0) {
								field.list = res.data.list;
								resolve();
							} else {
								this.$message.error(res.errmsg||res.msg);
							}
						});
					} else {
						field.asyncList().then(list=>{
							field.list = list;
							resolve();
						});
					}
				});
			},
			submit(){
				for(let field of this.fields){
					if(field.type=='file' && field.loading) {
						this.$message({
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
			},
			btnClick(btn, evt){
				if(btn.click)
					btn.click.call(this, btn, evt);
			}
		}
	}
</script>