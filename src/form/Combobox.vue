<template>
	<div>
		<input
			v-model="text"
			:type="field.nativeType||'text'"
			:name="field.name"
			class="st-form-input"
			@focus="initDropdown();$emit('fieldfocus')"
			@blur="$emit('fieldblur')"
			@keydown.down.prevent="hlNext"
			@keydown.up.prevent="hlPre"
		/>
	</div>
</template>

<script>
import XDropdown from './Dropdown.vue';
import Ajax from '../util/Ajax.js';
import {loadJs, $type} from '../util/util';
import qtip from '../com/qtip.js';
export default {
	props: {
		field: {
			type: Object,
			default(){
				return {};
			}
		}
	},
	data(){
		let val = this.field.value||'';
		return {
			value: val,
			text: this.field.list[val]||''
		};
	},
	methods: {
		initDropdown(){
			if(this.dropdown)
				return;
			let el = document.createElement('div');
			el.className = 'st-dropdown';
			document.body.appendChild(el);
			this.dropdown = new Vue({
				el,
				components: {XDropdown},
				provide: {
					field: this.field
				},
				template: '<x-dropdown></x-dropdown>'
			});
			if(this.field.pinyin!==false){
				this.pinyinP = loadJs('https://cdn.jsdelivr.net/gh/inagora/STable/dist/pinyin.min.js');
			}
			if(this.field.asyncList) {
				if($type(this.field.asyncList)=='string')
					Ajax.request({
						url: this.field.asyncList
					}).then(res=>{
						if(res.errno==0 || res.code==0) {
							this.field.list = res.data.list;
							this.formatList();
						} else {
							qtip.error(res.errmsg||res.msg);
						}
					});
				else
					this.field.asyncList(this.field).then(list=>{
						this.field.list = list;
						this.formatList();
					});
			} else {
				this.formatList();
			}

		},
		formatList(){
			let field = this.field;
			if(!Array.isArray(field.list)) {
				field.list = Object.keys(field.list).map(key=>({
					text: field.list[key],
					value: key
				}));
			} else {
				field.list = field.list.map(item=>{
					if($type(item)=='string') {
						return {
							text: item,
							value: item
						};
					}
					return item;
				});
			}
			if(field.pinyin){
				this.pinyinP.then(()=>{
					this.pinyinP = null;
					let py = window.STable.Pinyin;
					let joinText = function(arr){
						return arr.map(item=>item[0]).join('');
					};
					field.list.forEach(item=>{
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
		hlNext(evt){
			this.dropdown&&this.dropdown.hlNext();
		},
		hlPre(){
			this.dropdown&&this.dropdown.hlPre();
		}
	}
};
</script>

<style>

</style>
