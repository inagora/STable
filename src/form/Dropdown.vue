<template>
	<div
		v-show="visible"
		class="st-ddm"
		:style="{
			width: width+'px',
			top: top+'px'
		}"
	>
		<div
			v-for="(item,idx) of field.list"
			:key="idx"
			tabindex="0"
			class="st-ddm-item"
			:class="{'st-ddm-item-hl': idx==hlIdx}"
			@mouseenter="hlIdx=idx"
		>
			<span v-text="item.text"></span>
		</div>
	</div>
</template>

<script>
export default {
	inject: ['field'],
	data(){
		return {
			visible: false,
			val: '',
			hlIdx: -1,
			width: 0,
			top: 0
		};
	},
	methods: {
		hide(){
			this.visible = false;
		},
		show(alignTo){
			this.visible = true;
			this.$nextTick(()=>{
				let rect = this.$el.getBoundingClientRect();
				let alignRect = alignTo.getBoundingClientRect();
				let docEl = document.documentElement;
				this.width = alignRect.width;
				if(alignRect.bottom+rect.height < docEl.height) {
					this.top = alignRect.bottom;
				} else {
					this.top = -rect.height-5;
				}
			});
		},
		hlNext(){
			this.hlIdx++;
			if(this.hlIdx>=this.field.list.length)
				this.hlIdx=0;
			
			this.$nextTick(()=>{
				let item=this.$el.querySelector('.st-ddm-item-hl');
				if(item){
					if(item.scrollIntoViewIfNeeded)
						item.scrollIntoViewIfNeeded();
					else
						item.scrollIntoView();
				}
			});
		},
		hlPre(){
			this.hlIdx--;
			if(this.hlIdx<0)
				this.hlIdx = this.field.list.length-1;
			this.$nextTick(()=>{
				let item=this.$el.querySelector('.st-ddm-item-hl');
				if(item){
					if(item.scrollIntoViewIfNeeded)
						item.scrollIntoViewIfNeeded();
					else
						item.scrollIntoView();
				}
			});
		},
		select(){
			if(this.visible){
				this.$emit('select',this.field.list[this.hlIdx]);
				this.visible = false;
			}
		}
	}
};
</script>

<style lang="scss">
.st-ddm{
	position: absolute;
	font-weight: 400;
	background-color: #efeff2;
	border: 1px solid rgba(192,192,192,.5);
	border-radius: 5px;
	max-height: 200px;
	overflow-x: hidden;
	overflow-y: auto;
	left: 0;
	box-shadow: 0 5px 17px -4px rgba(0,0,0,.6);
	padding: 5px 0;

	&-item{
		display: block;
		line-height: 2;
		padding: 0 10px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: pointer;
	}
	&-item-hl{
		background-color: #4d91f7;
		color: #fff;
	}
}
</style>