import {loadJs, $type} from '../util/util';
import Ajax from '../util/Ajax.js';
import qtip from '../com/qtip.js';

import XDropdown from './Dropdown.vue';
import validate from './validate.mixin.js';

function fObj(p,list){
	Object.keys(list).map(key=>{
		let item = {
			value: key,
			text: list[key].text
		};
		if(list[key].options||list[key].list){
			item.options = [];
			fObj(item.options, list[key].options||list[key].list);
		}
		p.push(item);
	});
}
function fArr(p,list){
	list.forEach(o=>{
		let item = {
			value: o[0],
			text: o[1]
		};
		if(o[2] && Array.isArray(o[2])){
			item.options = [];
			fArr(item.options, o[2]);
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
			Ajax.request({
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
	methods: {
		formatList(_list){
			let field = this.field;
			let list = _list || field.options;
			let options = [];

			if(field.type=='cascader'){
				if(!Array.isArray(list)){
					
					fObj(options, list);
				} else {
					if(list.length<=0 || !Array.isArray(list[0])) {
						return;
					}
					fArr(options, list);
				}
			} else {
				if(!Array.isArray(list)) {
					options = Object.keys(list).map(key=>({
						text: list[key],
						value: key,
						visible: true,
						lowerText: list[key].toLocaleLowerCase()
					}));
				} else {
					options = list.map(item=>{
						if($type(item)=='string') {
							return {
								text: item,
								value: item,
								visible: true,
								lowerText: item.toLocaleLowerCase()
							};
						}
						return item;
					});
				}
			}
			
			this.options = options;
			this.initSelect();

			if(this.field.supportPinyinSearch){
				loadJs('https://cdn.jsdelivr.net/gh/inagora/STable/dist/pinyin.min.js').then(()=>{
					let py = window.STable.Pinyin;
					let joinText = function(arr){
						return arr.map(item=>item[0]).join('');
					};
					options.forEach(item=>{
						let text = item.text.toLocaleLowerCase();
						item._s = [
							text,
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
			// if(!this.field.filterable)
			// 	this.focus();
			let field = this;
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
								if(this.selIdxes.includes(idx)){
									this.selIdxes = this.selIdxes.filter(i=>i!=idx);
								} else {
									this.selIdxes.push(idx);
								}
								let value = this.selIdxes.map(i=>this.options[i].value);
								this.$emit('input', value);
							}else{
								let value;
								if(this.field.type=='cascader'){
									this.selIdxes = idx;
									value = [];
									let p = this.options;
									for(let i of idx){
										if(p[i]){
											value.push(p[i].value);
											p = p[i].options;
										}
									}
									field.$emit('input', value);
								}else {
									this.selIdxes = [idx];
									field.$emit('input', this.options[idx].value);
								}
								field.selIdxes = this.selIdxes;

								this.$refs.ddm.hide();
								this.$nextTick(()=>{
									if(this.field.type!='cascader')
										field.$el.querySelector('input').focus();
									setTimeout(()=>{
										let text = '';
										let value = [];
										if(this.field.type=='cascader'){
											text = [];
											let p = this.options;
											
											for(let idx of this.selIdxes){
												text.push(p[idx].text);
												value.push(p[idx].value);
												p = p[idx].options;
											}
											text = text.join(' / ');
											field.$emit('input', value);
										} else {
											text = this.options[idx].text;
											field.$emit('input', this.options[idx].value);
										}
										
										field.text = text;
										this.$refs.ddm.hide();
									}, 10);
								});
							}
						},
						changeVisible(val){
							field.ddmVisible = val;
						}
					},
					template: '<x-dropdown ref="ddm" :options="options" :selected="selIdxes" :type="field.type" @update:visible="changeVisible" @select="changeVal"/>'
				});
				this.ddm = ddm.$refs.ddm;
				this.ddm.bindAlign(this.$el);
			}
			this.ddm.show();
		}
	}
};