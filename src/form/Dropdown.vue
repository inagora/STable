<template>
	<div
		v-show="visible && (type=='cascader'||visibleCount>0)"
		class="st-ddm"
		:class="{'st-ddm-cascader': type=='cascader'}"
		:style="{
			top: top+'px',
			left: left+'px'
		}"
		@click.stop
	>
		<div
			v-for="(menu, level) of menuList"
			:key="level"
			class="st-ddm-fly"
			:style="{
				width: width+'px'
			}"
			@mouseleave="hlIndex=-1;hlLevel=0"
		>
			<template v-for="(item,idx) of menu">
				<div
					v-if="type=='cascader'||item.visible"
					:key="idx"
					class="st-ddm-item"
					:class="{
						'st-ddm-hl': idx==hlIndex && hlLevel==level,
						'st-ddm-sel': type=='cascader'?selIndexes[level]==idx : selIndexes.includes(idx)
					}"
					@mouseenter="hlItem(idx, level)"
					@mouseup="select(item, level, idx)"
				>
					<span class="st-ddm-check">✓</span>
					<span
						:title="item.text"
						class="st-ddm-text"
						v-text="item.text"
					>
					</span>
					<span v-if="type=='cascader'" :class="{'st-ddm-expand-visible': item.options}" class="st-ddm-expand">&#8250;</span>
				</div>
			</template>
		</div>
	</div>
</template>
<script>
/**
 * 注意，因为menu同时为combobox，cascader和multiple服务，所以它的功能其实挺复杂的
 * 1、multiple和combobox是支持搜索过滤的，cascader不支持(考虑它的搜索复杂性)
 * 2、multiple和combobox只有一个菜单，cascader有多级。所以整体设计上，以cascader为标准模型，单一菜单只是特例
 * 3、multiple和cascader的结果都是数组，combobox是一个值，所以把结果都归一为数组，combobox为特例，只有一个元素的数组
 * 4、因为整个模型都是以“数组”或者叫“多菜单”为标准的，所以数据上都是数组，比如选中项selected，展示菜单menuList
 */
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
		},
		type: {
			type: String,
			default: 'combobox'
		},
		pinyinSearchable: {
			type: Boolean,
			default: false
		}
	},
	data(){
		return {
			visible: false,
			hlIndex: -1,
			hlLevel: 0,
			visibleCount: 0,
			width: 150,
			top: -10000,
			left: 0,
			selIndexes: this.selected.slice(0),
			menuList: []
		};
	},
	watch: {
		visible(val){
			this.$emit('update:visible', val);
			if(val && this.selIndexes.length>0){
				this.$nextTick(()=>{
					let els = this.$el.querySelectorAll('.st-ddm-sel');
					if(!els.length<=0) return;
					for(let el of els){
						if(el.scrollIntoViewIfNeeded){
							el.scrollIntoViewIfNeeded();
						} else {
							el.scrollIntoView();
						}
					}
				});
			}
		},
		selected(val){
			this.selIndexes = val.slice(0);
			this.$nextTick(()=>{
				this.adjustPos();
			});
		}
	},
	mounted(){
		this.rebuildMenu();
		allDdm.push(this);
	},
	beforeDestroy(){
		allDdm = allDdm.filter(ddm=>ddm!=this);
	},
	methods: {
		rebuildMenu(val){
			let options = this.options;
			if(val) options = val;
			this.filter(this.lastFilterKey||'');
			this.menuList = [options];
			let p  = options;
			for(let idx of this.selIndexes) {
				if(p[idx]){
					p = p[idx].options;
					if(p)
						this.menuList.push(p);
					else
						break;
				} else {
					break;
				}
			}
		},
		bindAlign(alignEl){
			this.alignEl = alignEl;
		},
		show(){
			this.visible = true;
			allDdm.forEach(ddm=>{
				if(ddm!=this)
					ddm.hide();
			});
			this.$nextTick(()=>{
				this.adjustPos();
			});
		},
		adjustPos(){
			if(!this.alignEl) return;
			let rect = this.$el.getBoundingClientRect();
			let alignEl = this.alignEl;
			let alignRect = alignEl.getBoundingClientRect();
			let docEl = document.documentElement;
			if(this.type != 'cascader') {
				this.width = alignRect.width;
			}

			if(alignRect.bottom+rect.height-docEl.scrollTop < docEl.clientHeight) {
				this.top = alignRect.bottom+5-docEl.scrollTop;
			} else {
				this.top = alignRect.top+docEl.scrollTop-rect.height-5;
			}

			if(alignRect.left+rect.width-docEl.scrollLeft < docEl.clientWidth) {
				this.left = alignRect.left-docEl.scrollLeft;
			} else {
				this.left = docEl.clientWidth+docEl.scrollLeft-rect.width;
			}
		},
		hide(){
			this.visible = false;
		},
		hlItem(idx, level){
			this.hlIndex = idx;
			this.hlLevel = level;
		},
		//只对非cascader有效
		hlNext(){
			if(this.type=='cascader')
				return;
			let done = false;
			if(this.type=='combobox' && this.hlIndex<0 && this.selected.length>0){
				this.hlIndex = this.selected[0];
			} else {
				for(let i=this.hlIndex+1,len=this.options.length;i<len;i++){
					if(this.options[i].visible){
						this.hlIndex = i;
						done = true;
						break;
					}
				}
			}
			if(!done){
				for(let i=0;i<this.hlIndex;i++) {
					if(this.options[i].visible){
						this.hlIndex = i;
						done = true;
						break;
					}
				}
			}
			
			this.hl();
		},
		//只对非cascader有效
		hlPre(){
			if(this.type=='cascader')
				return;
			let done = false;
			for(let i=this.hlIndex-1;i>=0;i--){
				if(this.options[i].visible){
					this.hlIndex = i;
					done = true;
					break;
				}
			}
			if(!done){
				for(let i=this.options.length-1;i>this.hlIndex;i--) {
					if(this.options[i].visible) {
						this.hlIndex = i;
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
				let items=this.$el.querySelectorAll('.st-ddm-hl');
				for(let item of items){
					if(item){
						if(item.scrollIntoViewIfNeeded)
							item.scrollIntoViewIfNeeded();
						else
							item.scrollIntoView();
					}
				}
			});
		},
		filter(key){
			if(this.type!='cascader'){
				this.lastFilterKey = key;
				key = key.trim().toLowerCase();
				let visibleCount = 0;
				if(!key){
					this.options.forEach(item=>{
						item.visible = true;
					});
					visibleCount = this.options.length;
				} else {
					this.options.forEach(item=>{
						let visible = item.lowerText.includes(key);
						if(!visible && this.pinyinSearchable) {
							visible = item._s[0].includes(key) || item._s[1].includes(key) || item._s[2].includes(key);
						}
						item.visible = visible;
						if(item.visible)
							visibleCount++;
					});
				}
				
				this.visibleCount = visibleCount;
			}
			if(this.visible){
				// let hlIndex = -1;
				// if(this.type!='cascader'){
				// 	for(let i=0,len=this.options.length;i<len;i++) {
				// 		if(this.options[i].visible){
				// 			hlIndex = i;
				// 			break;
				// 		}
				// 	}
				// }
				// this.hlIndex = hlIndex;
				this.hl();
				this.show();
			}
		},
		/**
		 * 有两种操作，对combobox和multiple就是选中或取消，
		 * 对cascader可能还有展开下一级菜单操作
		 */
		select(item, level, idx){
			if(!this.visible)
				return;
			if(this.type!='cascader'){
				this.$emit('select', this.hlIndex);
			} else {
				let selected = this.selIndexes.slice(0, level+1);
				selected[level] = idx;
				this.selIndexes = selected;
				if(item.options) {
					this.menuList.splice(level+1);
					this.menuList.push(item.options);
					this.$nextTick(()=>{
						this.adjustPos();
					});
				} else {
					this.$emit('select', selected);
				}
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.st-ddm{
	position: absolute;
	font-weight: 400;
	// border-radius: 5px;
	left: 0;
	box-shadow: 0 2px 5px -2px rgba(0,0,0,.6);
	z-index: 100;
	display: flex;
	justify-content: flex-start;
	border-radius: 5px;


	&-fly{
		background-color: #efeff2;
		padding: 5px 0;
		max-height: 200px;
		overflow-x: hidden;
		overflow-y: auto;
		border: 1px solid rgba(192,192,192,.5);
		border-left: none;
	}

	&>div:first-of-type{
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
		border-left: 1px solid rgba(192,192,192,.5);
	}
	&>div:last-of-type{
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}

	&-item{
		display: flex;
		line-height: 32px;
		font-size: 14px;
		padding: 0 10px 0 5px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: pointer;
	}
	&-text{
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	&-hl{
		background-color: rgba(77,145,247,0.2);
	}
	&-sel{
		background-color: #4d91f7;
		color: #fff;
	}
	&-hl.st-ddm-sel{
		background-color: rgba(77,145,247,0.2);
		color: inherit;
	}
	&-check{
		visibility: hidden;
		padding-right: 4px;
	}
	&-sel &-check{
		visibility: visible;
	}

	&-expand{
		visibility: hidden;
	}
	& &-expand-visible{
		visibility: visible;
	}
}
</style>