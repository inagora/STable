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
import select from './select.mixin.js';
export default {
	mixins: [select],

	methods: {
		initSelect(){
			console.log('init select index')
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
					console.log(this.value, this.options[i].value)
					if(this.value == this.options[i].value){
						selIdxes = [i];
						break;
					}
				}
			}
			console.log('init', selIdxes);
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
		},
		changeVal(idx){
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
				this.$emit('input', value);
			}else {
				this.selIdxes = [idx];
				this.$emit('input', this.options[idx].value);
			}

			this.$refs.ddm.hide();
			this.$nextTick(()=>{
				if(this.field.type!='cascader')
					this.$el.querySelector('input').focus();
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
						this.$emit('input', value);
					} else {
						text = this.options[idx].text;
						this.$emit('input', this.options[idx].value);
					}
					this.text = text;
					this.$refs.ddm.hide();
				}, 10);
			});
			
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
