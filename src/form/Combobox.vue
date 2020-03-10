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
			class="st-cbb-trigger st-icon st-icon-left"
			:class="{'st-cbb-trigger-down':ddmVisible}"
			@click="$el.querySelector('input').focus();"
		></div>
		<div
			v-if="field.clearable && ['combobox','cascader'].includes(field.type) && selIdxes.length>0"
			class="st-cbb-clear st-icon st-icon-close"
			@click="selIdxes=[];$el.querySelector('input').focus();"
		></div>
		<span v-if="loading" class="st-icon st-icon-sync st-cbb-load"></span>
	</div>
</template>

<script>
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
		transform: rotate(180deg);
		transition: transform ease 0.2s;
	}
	.st-cbb-trigger.st-cbb-trigger-down{
		transform: rotate(270deg);
	}
	& &-clear{
		position: absolute;
		right: 3px;
		line-height: 16px;
		width: 16px;
		text-align: center;
		font-size: 12px;
		cursor: pointer;
		top: 50%;
		transform: translate(0, -50%);
		background: #8b8b8b;
		opacity: 0;
		transition: opacity 0.2s ease;
		color: #fff;
		border-radius: 50%;
	}
	&:hover &-clear{
		opacity: 1;
	}
}
</style>
