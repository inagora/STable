<template>
	<el-form v-bind="$attrs" :inline="inline" @submit.native.prevent="submit" :rules="rules" :model="formData" ref="form">
		<template v-for="field in fields">
			<input
				v-if="field.type=='hidden'"
				type="hidden"
				:key="field.name"
				v-model="formData[field.name]"
				:name="field.name" />
			<el-form-item v-else :key="field.name" :label="field.label" :prop="field.name">
				<el-input
					v-if="field.type=='text'"
					v-model="formData[field.name]"
					type="text"
					:style="{width:field.width+'px'}"
					:pattern="field.pattern"
					:readonly="field.readonly"
					:required="field.required"
					:disabled="field.disabled"
					:placeholder="field.placeholder"
					:title="field.title"
					:name="field.name"
					@change="handleChange($event, field)"></el-input>
				<el-input
					v-else-if="field.type=='textarea'"
					v-model="formData[field.name]"
					type="textarea"
					:style="{width:field.width+'px'}"
					:pattern="field.pattern"
					:readonly="field.readonly"
					:disabled="field.disabled"
					:required="field.required"
					:placeholder="field.placeholder"
					:title="field.title"
					:name="field.name"
					@change="handleChange($event, field)"></el-input>
				<el-date-picker
					v-else-if="dateTypes.includes(field.type)"
					v-model="formData[field.name]"
					:type="field.type"
					:style="{width:field.width+'px'}"
					:value-format="field.format||dateFormat[field.type]"
					:readonly="field.readonly"
					:disabled="field.disabled"
					:required="field.required"
					:placeholder="field.placeholder"
					:title="field.title"
					:name="field.name"
					@change="handleChange($event, field)"></el-date-picker>
				<el-time-picker
					v-else-if="timeTypes.includes(field.type)"
					v-model="formData[field.name]"
					:value-format="field.format||timeFormat[field.type]"
					:format="field.format||timeFormat[field.type]"
					:style="{width:field.width+'px'}"
					:readonly="field.readonly"
					:disabled="field.disabled"
					:required="field.required"
					:placeholder="field.placeholder"
					:title="field.title"
					:name="field.name"
					@change="handleChange($event, field)"></el-time-picker>
				<div v-else-if="field.type=='radio'" class="st-radio-box">
					<label class="st-radio-item" v-for="(item, radioIdx) of field.list" :key="radioIdx">
						<input type="radio" :value="item.value" v-model="formData[field.name]" @change="handleChange($event, field, item, radioIdx)">
						<span v-text="item.text"></span>
					</label>
				</div>
				<div v-else-if="field.type=='checkbox'" class="st-radio-box">
					<label class="st-radio-item" v-for="(item, radioIdx) of field.list" :key="radioIdx">
						<input type="checkbox" :value="item.value" v-model="formData[field.name]" @change="handleChange($event, field, item, radioIdx)">
						<span v-text="item.text"></span>
					</label>
				</div>
				<el-select
					v-else-if="field.type=='combobox'||field.type=='multiple'"
					v-model="formData[field.name]"
					filterable
					:clearable="field.clearable"
					:default-first-option="true"
					:filter-method="field.filter"
					:style="{width:field.width+'px'}"
					:multiple="field.type=='multiple'"
					:readonly="field.readonly"
					:disabled="field.disabled"
					:required="field.required"
					:placeholder="field.placeholder"
					:title="field.title"
					:name="field.name"
					@change="handleChange($event, field)">
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
					:disabled="field.disabled"
					:required="field.required"
					:placeholder="field.placeholder"
					:title="field.title"
					:name="field.name"
					@change="handleChange($event, field)">
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
	import defaultLocale from '../../lang/en.js';
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
		inject: {
			locale: {
				default: defaultLocale
			}
		},
		components: {XFile},
		data(){
			let fields = this.formatField(this.fieldList);
			let formData = {};
			let rules = {};
			let dateTypes = ['year', 'month', 'date', 'datetime'];
			let selectTypes = ['combobox', 'multiple', 'cascade'];
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

				if(field.required) {
					let message = this.locale.requiredMsg;
					if(dateTypes.includes(field.type) || selectTypes.includes(field.type)) {
						message = this.locale.chooseMsg+field.label;
					} else {
						message = this.locale.inputMsg+field.label;
					}
					rules[field.name] = [{
						required: true,
						message,
						trigger: 'change'
					}];
				}

			});
		
			return {
				fields,
				formData,
				dateTypes,
				rules,
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
				loadJs('https://cdn.jsdelivr.net/gh/inagora/STable@v1.3.7/dist/pinyin.min.js').then(()=>{
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
						if(field.autoSelect && field.list.length>0) {
							field.value = field.list[0].value;
						}
						if(typeof field.clearable =='undefined'){
							field.clearable = true;
						}
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
				let data = {};
				for(let field of this.fields){
					if(field.type=='file' && field.loading) {
						this.$message({
							message: this.locale.uploadingMsg,
							type: 'info'
						});
						return;
					}
					if(!field.disabled) {
						data[field.name] = this.formData[field.name];
					}
				}
				//this.$emit('submit', data);
				this.$refs.form.validate((valid) => {
					if (valid) {
						this.$emit('submit', data);
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			reset(){
				this.$refs.form.resetFields();
			},
			handleChange(val, field, item, idx){
				if(field.listeners && field.listeners.change) {
					field.listeners.change.call(this, val, item, idx);
				}
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
<style>
.st-radio-box{
	display: flex;
	flex-wrap: wrap;
}
.st-radio-item{
	margin-right: 10px;
	color: #606266;
	cursor: pointer;
}
.st-radio-item:hover{
	color: #191919;
}
</style>
