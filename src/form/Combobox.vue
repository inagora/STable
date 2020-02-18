<template>
	<div class="st-cbb" @click.stop>
		<input
			v-model="text"
			type="text"
			:name="field.name"
			class="st-form-input"
			:placeholder="placeholder"
			:readonly="!field.filterable"
			@focus="focus();$emit('fieldfocus')"
			@blur="$emit('fieldblur')"
			@input="doFilter"
			@keydown.down.prevent="hlNext"
			@keydown.up.prevent="hlPre"
			@keydown.enter.prevent="$refs.ddm.select()"
			@mousedown="showDdm"
		/>
		<div
			class="st-cbb-trigger"
			:class="{'st-cbb-trigger-down':ddmVisible}"
			@click="$el.querySelector('input').focus();"
		>
			<span>&rsaquo;</span>
		</div>
		<x-dropdown
			ref="ddm"
			:options="options"
			:selected="[selIdx]"
			:type="field.type"
			@update:visible="ddmVisible=$event"
			@select="changeVal"
		/>
		<span v-if="loading" class="st-icon st-icon-sync st-cbb-load"></span>
	</div>
</template>

<script>
import XDropdown from './Dropdown.vue';
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
			selIdx: -1,
			loading: false,
			ddmVisible: false,
			placeholder: this.field.placeholder
		};
	},
	methods: {
		showDdm(){
			if(!this.field.filterable)
				this.focus();
		},
		doFilter(){
			this.filterTimer = setTimeout(()=>{
				if(this.filterTimer){
					clearTimeout(this.filterTimer);
					this.filterTimer = null;
				}
				this.$refs.ddm.show();
				this.$refs.ddm.filter(this.text);
			}, 100);
		},
		focus(){
			if(this.selIdx>=0) {
				this.placeholder = this.options[this.selIdx].text;
			} else {
				this.placeholder = this.field.placeholder;
			}
			this.text = '';
			this.$refs.ddm.filter(this.text);

			this.$refs.ddm.show();
		},
		changeVal(idx){
			this.selIdx = idx;
			this.$refs.ddm.hide();
			this.$nextTick(()=>{
				this.$el.querySelector('input').focus();
				setTimeout(()=>{
					this.text = this.options[idx].text;
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
