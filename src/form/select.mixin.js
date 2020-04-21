import {loadJs, $type} from '../util/util';
import qtip from '../com/qtip.js';

import XDropdown from './Dropdown.vue';
import validate from './validate.mixin.js';

function fObj(p,list){
	Object.keys(list).map(key=>{
		let item = {
			value: key
		};
		if($type(list[key])=='object'){
			item.text = list[key].text;
			if(list[key].options||list[key].list){
				item.options = [];
				fObj(item.options, list[key].options||list[key].list);
			}
		} else {
			item.text = list[key];
		}
		p.push(item);
	});
}
function fArr(p,list){
	list.forEach(o=>{
		let item = {};
		if(Array.isArray(o)){
			item = {
				value: o[0],
				text: o[1]
			};
			if(o[2] && Array.isArray(o[2])){
				item.options = [];
				fArr(item.options, o[2]);
			}
		} else {
			item = o;
			if(item.options||item.list){
				let options = [];
				fArr(options, item.options||item.list);
				item.options = options;
			}
		}
		p.push(item);
	});
}

export default {
	mixins: [validate],
	props: {
		value: {
			type: [String, Number, Array],
			default: ''
		},
		field: {
			type: Object,
			default(){
				return {};
			}
		}
	},
	inject: ['ajax'],
	components: {XDropdown},
	data(){
		return {
			options: [],
			text: '',
			selIdxes: [],
			loading: false,
			ddmVisible: false,
			placeholder: this.field.placeholder
		};
	},
	mounted(){
		document.documentElement.addEventListener('click', ()=>{
			if(this.field.type=='combobox'){
				if(this.selIdxes.length>0) {
					this.text = this.options[this.selIdxes[0]].text;
				} else {
					this.text = '';
				}
			}
			this.$nextTick(()=>{
				this.ddm && this.ddm.hide();
			});
		}, false);

		let dataType = $type(this.field.options);
		if(dataType=='string'){
			this.loading = true;
			this.ajax.request({
				url: this.field.options
			}).then(res=>{
				this.loading = false;
				if(res.errno==0 || res.code==0) {
					this.formatList(res.data.options);
				} else {
					qtip.error(res.errmsg||res.msg);
				}
			});
		} else if(dataType=='function') {
			this.loading = true;
			this.field.options(this.field).then(list=>{
				this.loading = false;
				this.formatList(list);
			});
		} else {
			this.formatList();
		}
		this.formatRule();
	},
	watch: {
		selIdxes(val){
			let type = this.field.type;
			let value=[];
			let text = '';
			if(type=='combobox'){
				value = '';
				if(this.options[val[0]]){
					value = this.options[val[0]].value;
					text = this.options[val[0]].text;
				}
			} else if(type=='multiple'){
				value = val.map(i=>this.options[i].value);
			} else if(type=='cascader'){
				let p = this.options;
				text = [];
				for(let i of val){
					if(p[i]){
						text.push(p[i].text);
						value.push(p[i].value);
						p = p[i].options;
					} else {
						break;
					}
				}
				text = text.join(' / ');
			}
			this.text = text;
			this.$emit('input', value);
			if(this.ddm){
				this.ddm.$parent.selIdxes = val;
			}
		}
	},
	methods: {
		formatList(_list){
			let field = this.field;
			let list = _list || field.options;
			list.forEach(item => {
				if(!item.text)
					item.text = item.label;
			});
			let options = [];

			if(field.type=='cascader'){
				if(!Array.isArray(list)){
					fObj(options, list);
				} else {
					fArr(options, list);
				}
			} else {
				if(!Array.isArray(list)) {
					options = Object.keys(list).map(key=>({
						text: list[key],
						value: key,
						visible: true,
						lowerText: list[key].toLowerCase()
					}));
				} else {
					options = list.map(item=>{
						if($type(item)=='string') {
							return {
								text: item,
								value: item,
								visible: true,
								lowerText: item.toLowerCase()
							};
						}
						item.lowerText = item.text.toLowerCase();
						item.visible = true;
						return item;
					});
				}
			}
			
			this.options = options;
			this.initSelect();

			if(this.field.pinyinSearchable){
				loadJs('https://cdn.jsdelivr.net/gh/inagora/STable@v2.0.0-beta.46/dist/pinyin.min.js').then(()=>{
					let py = window.STable.Pinyin;
					let joinText = function(arr){
						return arr.map(item=>item[0]).join('');
					};
					options.forEach(item=>{
						let text = item.lowerText;
						item._s = [
							joinText(py(text, {style:py.STYLE_FIRST_LETTER})),
							joinText(py(text, {style:py.STYLE_INITIALS})),
							joinText(py(text, {style:py.STYLE_NORMAL}))
						];
					});
				});
			}
		},
		hlNext(){
			this.ddm&&this.ddm.hlNext();
		},
		hlPre(){
			this.ddm&&this.ddm.hlPre();
		},
		showDdm(){
			let com = this;
			if(!this.ddm){
				let el = document.createElement('div');
				document.body.appendChild(el);
				let ddm = new Vue({
					el,
					components: {
						XDropdown
					},
					data: {
						options: this.options,
						selIdxes: this.selIdxes,
						field: this.field,
						ddmVisible: false,
						visible: false
					},
					methods: {
						changeVal(idx){
							if(this.field.type=='multiple'){
								let selIdxes = this.selIdxes.slice(0);
								if(selIdxes.includes(idx)){
									selIdxes = selIdxes.filter(i=>i!=idx);
								} else {
									selIdxes.push(idx);
								}
								com.selIdxes = selIdxes;
							}else{
								if(this.field.type=='cascader'){
									com.selIdxes = idx.slice(0);
								}else {
									com.selIdxes = [idx];
								}

								this.$refs.ddm.hide();
								setTimeout(()=>{
									if(this.field.type!='cascader'){
										com.$el.querySelector('input').focus();
										this.$refs.ddm.hide();
									}
								}, 10);
							}
						},
						changeVisible(val){
							com.ddmVisible = val;
						}
					},
					template: '<x-dropdown ref="ddm" :options="options" :selected="selIdxes" :type="field.type" :pinyin-searchable="field.pinyinSearchable" @update:visible="changeVisible" @select="changeVal"/>'
				});
				this.ddm = ddm.$refs.ddm;
				this.ddm.bindAlign(this.$el);
			}
			this.ddm.show();
		}
	}
};