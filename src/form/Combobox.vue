<template>
	<label class="st-cbb" @click.stop>
		<div class="st-cbb-item-list">
			<div
				v-for="idx of selected"
				:key="idx+'_'+options[idx].value"
				class="st-cbb-item st-cbb-selected"
				:style="{'max-width': maxSelLabelWidth+'px'}"
			>
				<span class="st-cbb-item-text" v-text="options[idx].text"></span>
				<span class="st-cbb-item-del" @click="selected.splice(selected.indexOf(idx), 1)">&#10005;</span>
			</div>
			<div class="st-cbb-item st-cbb-input-box">
				<input
					v-model="text"
					type="text"
					:name="field.name"
					class="st-form-input"
					:placeholder="selected.length==0 && placeholder"
					@focus="focus();$emit('fieldfocus')"
					@blur="$emit('fieldblur')"
					@keydown.down.prevent="hlNext"
					@keydown.up.prevent="hlPre"
					@keydown.enter.prevent="$refs.ddm.select()"
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
		<x-dropdown
			ref="ddm"
			:options="options"
			:selected="selected"
			@update:visible="ddmVisible=$event"
			@select="changeVal"
		/>
		<span v-if="loading" class="st-icon st-icon-sync st-cbb-load"></span>
	</label>
</template>

<script>
import XDropdown from './Dropdown.vue';
import Ajax from '../util/Ajax.js';
import {$type} from '../util/util';
import qtip from '../com/qtip.js';
import select from './select.mixin.js';
export default {
	components: {XDropdown},
	mixins: [select],
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
		return {
			options: [],
			text: '',
			selected: [],
			loading: false,
			ddmVisible: false,
			maxSelLabelWidth: 0,
			placeholder: this.field.placeholder
		};
	},
	watch: {
		text(){
			this.$refs.ddm.show();
			this.upadteInputWidth();
			this.filterTimer = setTimeout(()=>{
				if(this.filterTimer){
					clearTimeout(this.filterTimer);
					this.filterTimer = null;
				}
				this.$refs.ddm.filter(this.text);
			}, 100);
		},
		selected(val){
			if(val.length<=0) {
				this.$el.querySelector('input').style.width = this.maxInputLength+'px';
			} else {
				this.upadteInputWidth();
			}
		}
	},
	mounted(){
		let self = this;
		document.documentElement.addEventListener('click', function(){
			self.$refs.ddm && self.$refs.ddm.hide();
		}, false);

		let input = this.$el.querySelector('.st-form-input');
		let style = window.getComputedStyle(input);
		let mirror = this.$el.querySelector('.st-cbb-input-mirror');
		['fontFamily','fontSize','letterSpacing'].forEach(key=>{
			mirror.style[key] = style[key];
		});

		if(this.field.asyncList) {
			this.loading = true;
			if($type(this.field.asyncList)=='string') {
				Ajax.request({
					url: this.field.asyncList
				}).then(res=>{
					this.loading = false;
					if(res.errno==0 || res.code==0) {
						this.formatList(res.data.list);
					} else {
						qtip.error(res.errmsg||res.msg);
					}
				});
			} else
				this.field.asyncList(this.field).then(list=>{
					this.loading = false;
					this.formatList(list);
				});
		} else {
			this.formatList();
		}

		let inputBox = this.$el.querySelector('.st-cbb-input-box');
		let computedStyle = window.getComputedStyle(inputBox);
		this.maxInputLength = this.$el.querySelector('.st-cbb-item-list').clientWidth - parseInt(computedStyle.paddingLeft) - parseInt(computedStyle.paddingRight);
		this.maxSelLabelWidth = this.$el.querySelector('.st-cbb-item-list').clientWidth-4;
		if(this.selected.length<=0){
			this.$el.querySelector('input').style.width = this.maxInputLength+'px';
		}
	},
	methods: {
		focus(){
			this.$refs.ddm.show();
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
		changeVal(idx){
			if(this.selected.includes(idx)){
				this.selected.splice(this.selected.indexOf(idx), 1);
			} else {
				this.selected.push(idx);
			}
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
