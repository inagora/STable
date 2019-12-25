<template>
	<div class="st-combobox" @click.stop>
		<label class="st-combobox-input-box">
			<input
				v-model="text"
				:type="field.nativeType||'text'"
				:name="field.name"
				class="st-form-input"
				@focus="showDropdown();$emit('fieldfocus')"
				@blur="$emit('fieldblur')"
				@keydown.down.prevent="hlNext"
				@keydown.up.prevent="hlPre"
				@keydown.enter.prevent="select"
			/>
			<div class="st-combobox-trigger">
				<span>&rsaquo;</span>
			</div>
		</label>
		<x-dropdown ref="ddm" @select="changeVal" />
	</div>
</template>

<script>
import XDropdown from './Dropdown.vue';
import Ajax from '../util/Ajax.js';
import {loadJs, $type} from '../util/util';
import qtip from '../com/qtip.js';
export default {
	components: {XDropdown},
	props: {
		field: {
			type: Object,
			default(){
				return {};
			}
		}
	},
	provide(){
		return {
			field: this.field
		};
	},
	data(){
		let val = this.field.value||'';
		return {
			value: val,
			text: this.field.list[val]||''
		};
	},
	mounted(){
		let self = this;
		document.documentElement.addEventListener('click', function(){
			self.$refs.ddm.hide();
		}, false);
	},
	methods: {
		showDropdown(){
			this.$refs.ddm.show(this.$el);
			if(this.inited) return;
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
			this.$refs.ddm.show(this.$el);
			this.inited = true;
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
		hlNext(){
			this.$refs.ddm&&this.$refs.ddm.hlNext();
		},
		hlPre(){
			this.$refs.ddm&&this.$refs.ddm.hlPre();
		},
		select(){
			this.$refs.ddm.select();
		},
		changeVal(data){
			this.value = data.value;
			this.text = data.text;
		}
	}
};
</script>

<style lang="scss">
.st-combobox{
	position: relative;

	&-input-box{
		display: flex;
		align-items: center;
	}

	&-trigger{
		font-size: 20px;
		padding: 0 5px;
		transition: transform ease 0.2s;
	}
	&-trigger-down span{
		display: block;
		transform: rotate(90deg);
	}
}
</style>
