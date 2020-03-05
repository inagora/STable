<template>
	<div class="st-cbb" @click.stop>
		<input
			v-model="text"
			type="text"
			:name="field.name"
			class="st-form-input"
			autocomplete="off"
			:placeholder="placeholder"
			:readonly="!field.filterable"
			@focus="focus();$emit('fieldfocus')"
			@blur="$emit('fieldblur')"
			@input="doFilter"
			@keydown.down.prevent="hlNext"
			@keydown.up.prevent="hlPre"
			@keydown.enter.prevent="enterSelect"
			@mousedown="showDdm"
		/>
		<div
			class="st-cbb-trigger"
			:class="{'st-cbb-trigger-down':ddmVisible}"
			@click="$el.querySelector('input').focus();"
		>
			<span>&rsaquo;</span>
		</div>
		<span v-if="loading" class="st-icon st-icon-sync st-cbb-load"></span>
	</div>
</template>

<script>
//todo dropdownmenu选择后不能反馈到input中
import select from './select.mixin.js';
export default {
	mixins: [select],

	methods: {
		initSelect(){
			let selIdxes = [];
			if(this.field.type=='cascader') {
				let p = this.options;
				for(let v of this.value) {
					let match = false;
					for(let i=0,len=p.length;i<len;i++){
						if(v == p[i].value){
							match = true;
							selIdxes.push(i);
							p = p[i].options;
							break;
						}
					}
					if(!match){
						break;
					}
				}
			} else {
				for(let i=0,len=this.options.length;i<len;i++){
					if(this.value == this.options[i].value){
						selIdxes = [i];
						break;
					}
				}
			}
			this.selIdxes = selIdxes;
		},
		enterSelect(){
			this.ddm.select();
		},
		doFilter(){
			if(this.filterTimer){
				clearTimeout(this.filterTimer);
				this.filterTimer = null;
			}
			this.filterTimer = setTimeout(()=>{
				this.showDdm();
				this.ddm&&this.ddm.filter(this.text);
			}, 100);
		},
		focus(){
			// if(this.field.type=='combobox'){
			// 	let selIdxes = this.selIdxes;
			// 	if(selIdxes.length>0 && selIdxes[0]>=0) {
			// 		this.placeholder = this.options[selIdxes[0]].text;
			// 	} else {
			// 		this.placeholder = this.field.placeholder;
			// 	}
			// 	this.text = '';
			// 	this.$refs.ddm.filter(this.text);
			// }
			this.showDdm();
		}
	}
};
</script>

<style lang="scss">
.st-cbb{
	position: relative;
	display: flex;
	align-items: center;

	& .st-form-input{
		height: 30px;
		padding: 4px 5px 4px 11px;
		line-height: 30px;
	}
	&-trigger{
		font-size: 20px;
		width: 20px;
		line-height: 20px;
		cursor: pointer;
	}
	&-trigger span{
		display: block;
		text-align: center;
		transition: transform ease 0.2s;
	}
	&-trigger-down span{
		transform: rotate(90deg);
	}
}
</style>
