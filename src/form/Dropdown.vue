<template>
	<div
		v-show="visible"
		class="st-ddm"
		:style="{
			width: width+'px',
			top: top+'px'
		}"
	>
		<template v-for="(item,idx) of options">
			<div
				v-if="item.visible"
				:key="idx"
				class="st-ddm-item"
				:class="{
					'st-ddm-item-hl': idx==hlIdx,
					'st-ddm-item-sel': selected.includes(idx)
				}"
				@mouseenter="hlIdx=idx"
				@click="select"
			>
				<span class="st-ddm-item-check">✓</span>
				<span :title="item.text" v-text="item.text"></span>
			</div>
		</template>
	</div>
</template>

<script>
let allDdm = [];
export default {
	props: {
		options: {
			type: Array,
			default(){
				return [];
			}
		},
		selected: {
			type: Array,
			default(){
				return [];
			}
		}
	},
	data(){
		return {
			visible: false,
			val: '',
			hlIdx: -1,
			width: 0,
			top: 0
		};
	},
	watch: {
		visible(val){
			this.$emit('update:visible', val);
		}
	},
	mounted(){
		allDdm.push(this);
	},
	beforeDestroy(){
		allDdm = allDdm.filter(ddm=>ddm!=this);
	},
	methods: {
		hide(){
			this.visible = false;
		},
		show(){
			console.log('show')
			this.visible = true;
			allDdm.forEach(ddm=>{
				if(ddm!=this)
					ddm.hide();
			});
			this.$nextTick(()=>{
				let alignTo = this.$el.closest('.st-cbb');
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
			let done = false;
			for(let i=this.hlIdx+1,len=this.options.length;i<len;i++){
				if(this.options[i].visible){
					this.hlIdx = i;
					done = true;
					break;
				}
			}
			if(!done){
				for(let i=0;i<this.hlIdx;i++) {
					if(this.options[i].visible){
						this.hlIdx = i;
						done = true;
						break;
					}
				}
			}
			
			this.hl();
		},
		hlPre(){
			let done = false;
			for(let i=this.hlIdx-1;i>=0;i--){
				if(this.options[i].visible){
					this.hlIdx = i;
					done = true;
					break;
				}
			}
			if(!done){
				for(let i=this.options.length-1;i>this.hlIdx;i--) {
					if(this.options[i].visible) {
						this.hlIdx = i;
						done = true;
						break;
					}
				}
			}
			
			this.hl();
		},
		hl(){
			this.visible = true;
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
				this.$emit('select', this.hlIdx);
			}
		},
		filter(key){
			key = key.trim().toLowerCase();
			if(!key){
				this.options.forEach(item=>{
					item.visible = true;
				});
			} else {
				this.options.forEach(item=>{
					item.visible = item.text.includes(key);
				});
			}
			if(this.visible){
				let hlIdx = -1;
				for(let i=0,len=this.options.length;i<len;i++) {
					if(this.options[i].visible){
						hlIdx = i;
						break;
					}
				}
				this.hlIdx = hlIdx;
				console.log('filter')
				this.hl();
				this.show();
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
	box-shadow: 0 2px 5px -2px rgba(0,0,0,.6);
	padding: 5px 0;
	z-index: 99;

	&-item{
		display: block;
		line-height: 2;
		padding: 0 10px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: pointer;
	}
	& &-item-hl{
		background-color: #4d91f7;
		color: #fff;
	}
	&-item-sel{
		background-color: rgba(77,145,247,0.2);
	}
	&-item-check{
		visibility: hidden;
	}
	&-item-sel &-item-check{
		visibility: visible;
	}
}
</style>