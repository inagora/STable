<template>
	<label class="st-cbb" @click.stop>
		<div class="st-cbb-item-list">
			<div
				v-for="(idx, idxIndex) of selIdxes"
				:key="idx+'_'+options[idx].value"
				class="st-cbb-item st-cbb-selected"
				:class="{'st-cbb-item-hl': idxIndex==hlDelIndex}"
				:style="{'max-width': maxSelLabelWidth+'px'}"
			>
				<span class="st-cbb-item-text" v-text="options[idx].text"></span>
				<span class="st-cbb-item-del" @click="del(idx)">&#10005;</span>
			</div>
			<div class="st-cbb-item st-cbb-input-box">
				<input
					v-model="text"
					type="text"
					:name="field.name"
					autocomplete="off"
					class="st-form-input"
					:placeholder="selIdxes.length==0 && placeholder"
					@focus="focus();$emit('fieldfocus')"
					@blur="$emit('fieldblur');hlDelIndex=-1;"
					@keydown.down.prevent="hlNext"
					@keydown.up.prevent="hlPre"
					@keydown.left="hlDelPre"
					@keydown.right="hlDelNext"
					@keydown.enter.prevent="enterSelect"
					@keydown.delete="deleteSelect"
				/>
				<span class="st-cbb-input-mirror" v-text="text+'A'"></span>
			</div>
		</div>
		<div
			class="st-cbb-trigger"
			:class="{'st-cbb-trigger-down':ddmVisible}"
		>
			<span>&rsaquo;</span>
		</div>
		<span v-if="loading" class="st-icon st-icon-sync st-cbb-load"></span>
	</label>
</template>

<script>
import select from './select.mixin.js';
export default {
	mixins: [select],
	data(){
		return {
			maxSelLabelWidth: 0,
			hlDelIndex: -1
		};
	},
	watch: {
		text(){
			this.showDdm();
			this.upadteInputWidth();
			if(this.filterTimer){
				clearTimeout(this.filterTimer);
				this.filterTimer = null;
			}
			this.filterTimer = setTimeout(()=>{
				this.ddm && this.ddm.filter(this.text);
			}, 100);
		},
		selIdxes(val){
			if(val.length<=0) {
				this.$el.querySelector('input').style.width = this.maxInputLength+'px';
			} else {
				this.upadteInputWidth();
			}
		}
	},
	mounted(){
		let input = this.$el.querySelector('.st-form-input');
		let style = window.getComputedStyle(input);
		let mirror = this.$el.querySelector('.st-cbb-input-mirror');
		['fontFamily','fontSize','letterSpacing'].forEach(key=>{
			mirror.style[key] = style[key];
		});

		let inputBox = this.$el.querySelector('.st-cbb-input-box');
		let computedStyle = window.getComputedStyle(inputBox);
		this.maxInputLength = this.$el.querySelector('.st-cbb-item-list').clientWidth - parseInt(computedStyle.paddingLeft) - parseInt(computedStyle.paddingRight);

		this.maxSelLabelWidth = this.$el.querySelector('.st-cbb-item-list').clientWidth-4;
	},
	methods: {
		initSelect(){
			let selIdxes = [];
			let value = this.value;
			if(!Array.isArray(value)) {
				value = [value];
			}
			for(let i=0,len=this.options.length;i<len;i++) {
				if(value.includes(this.options[i].value)) {
					selIdxes.push(i);
				}
			}
			this.selIdxes = selIdxes;

			if(this.selIdxes.length<=0){
				this.$el.querySelector('input').style.width = this.maxInputLength+'px';
			}
		},
		focus(){
			this.showDdm();
			this.hlDelIndex = -1;
		},
		upadteInputWidth(){

			this.$nextTick(()=>{
				let mirror = this.$el.querySelector('.st-cbb-input-mirror');
				let w = mirror.clientWidth;
				if(w>this.maxInputLength)
					w = this.maxInputLength;
				this.$el.querySelector('input').style.width = w+'px';

				
			});
		},
		enterSelect(){
			this.ddm && this.ddm.select();
		},
		deleteSelect(){
			if(this.text){
				return;
			}

			if(this.hlDelIndex<0){
				this.hlDelIndex = this.selIdxes.length-1;
			} else {
				this.selIdxes = this.selIdxes.filter((sel, idx)=>{
					return idx != this.hlDelIndex;
				});
				if(this.selIdxes.length<0){
					this.hlDelIndex = -1;
				} else if(this.hlDelIndex>=this.selIdxes.length){
					this.hlDelIndex = this.selIdxes.length-1;
				}
			}
		},
		hlDelPre(){
			if(this.hlDelIndex<0){
				if(this.text)
					return;
				else if(this.selIdxes.length>0){
					this.hlDelIndex = this.selIdxes.length-1;
					return;
				}
			}
			let idx = this.hlDelIndex-1;
			if(idx<0)
				idx = this.selIdxes.length-1;
			this.hlDelIndex = idx;
		},
		hlDelNext(){
			if(this.hlDelIndex<0){
				if(this.text)
					return;
				else if(this.selIdxes.length>0){
					this.hlDelIndex = 0;
					return;
				}
			}
			let idx = this.hlDelIndex+1;
			if(idx>=this.selIdxes.length)
				idx = 0;
			this.hlDelIndex = idx;
		},
		del(idx){
			this.changeVal(idx);
		}
	}
};
</script>

<style lang="scss">
.st-cbb{
	&-item-list{
		flex: 1;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		min-height: 30px;
		padding-left: 5px;
	}

	&-item{
		white-space: nowrap;
	}
	&-selected{
		height: 24px;
		margin-top: 3px;
		line-height: 22px;
		background: #fafafa;
		color: rgba(0,0,0,0.65);
		margin-right: 4px;
		padding: 0 5px;
		border: 1px solid #e8e8e8;
		border-radius: 2px;
		font-size: 12px;
		display: flex;
	}
	&-item-hl{
		background-color: #dc3545;
		border-color: #dc3545;
		color: #fff;
	}
	&-item-hl &-item-del{
		color: #fff;
	}
	&-item-text{
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	&-item-del{
		user-select: none;
		color: rgba(0,0,0,0.45);
		cursor: pointer;
		margin-left: 5px;
	}
	&-item-del:hover{
		color: rgba(255,0,0,0.85);
	}


	&-input-box .st-form-input{
		padding: 4px 0;
		width: 10px;
	}
	&-input-mirror{
		position: absolute;
		top: 0;
		left: 0;
		white-space: pre;
		opacity: 0;
		pointer-events: none;
	}
}
</style>
