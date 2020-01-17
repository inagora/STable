<template>
	<div class="st-cbb" @click.stop>
		<input
			v-model="text"
			type="text"
			:name="field.name"
			class="st-form-input"
			:placeholder="placeholder"
			@focus="focus();$emit('fieldfocus')"
			@blur="$emit('fieldblur')"
			@input="doFilter"
			@keydown.down.prevent="hlNext"
			@keydown.up.prevent="hlPre"
			@keydown.enter.prevent="$refs.ddm.select()"
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
			@update:visible="ddmVisible=$event"
			@select="changeVal"
		/>
		<span v-if="loading" class="st-icon st-icon-sync st-cbb-load"></span>
	</div>
</template>

<script>
import XDropdown from './Dropdown.vue';
import Ajax from '../util/Ajax.js';
import { $type} from '../util/util';
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
			selIdx: -1,
			loading: false,
			ddmVisible: false,
			placeholder: this.field.placeholder
		};
	},
	mounted(){
		document.documentElement.addEventListener('click', ()=>{
			if(this.selIdx>=0) {
				this.text = this.options[this.selIdx].text;
			} else {
				this.text = '';
			}
			this.$nextTick(()=>{
				this.$refs.ddm && this.$refs.ddm.hide();
			});
		}, false);

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
	},
	methods: {
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
