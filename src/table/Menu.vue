<template>
	<div
		v-show="visible"
		class="st-table-menu-box"
		:style="{
			left: left+'px',
			top: top + 'px'
		}"
		@click.stop
	>
		<div class="st-table-menu">
			<template v-if="curIdx>=0">
				<div
					class="st-table-menu-item"
					@click="toggleVisible(curIdx)"
					@mouseenter="showSubmenu('')"
				>
					<i
						class="st-icon"
						:class="[list[curIdx].visible?'st-icon-eye':'st-icon-eye-close']"
					></i>
					<span v-text="list[curIdx].text"></span>
				</div>
				<div
					class="st-table-menu-item"
					:class="{
						'st-table-menu-item-hover': submenu=='lock'
					}"
					@mouseenter="showSubmenu('lock', $event)"
				>
					<i class="st-icon st-icon-lock"></i>
					<span>冻结位置</span>
					<i class="st-icon st-icon-caret-down st-table-menu-more"></i>
				</div>
			</template>

			<div
				class="st-table-menu-item"
				:class="{
					'st-table-menu-item-hover': submenu=='column'
				}"
				@mouseenter="showSubmenu('column', $event)"
			>
				<i class="st-icon st-icon-filter"></i>
				<span>列筛选</span>
				<i class="st-icon st-icon-caret-down st-table-menu-more"></i>
			</div>
		</div>

		<div v-if="submenu=='lock'" class="st-table-menu st-table-submenu">
			<div
				class="st-table-menu-item"
				@click="lock('left')"
			>
				<i
					class="st-icon"
					:class="{
						'st-icon-check-square st-table-menu-selected': list[curIdx].locked=='left',
						'st-icon-border': list[curIdx].locked!='left'
					}"
				></i>
				<span>左侧</span>
			</div>
			<div
				class="st-table-menu-item"
				@click="lock('right')"
			>
				<i
					class="st-icon"
					:class="{
						'st-icon-check-square st-table-menu-selected': list[curIdx].locked=='right',
						'st-icon-border': list[curIdx].locked!='right'
					}"
				></i>
				<span>右侧</span>
			</div>
			<div
				class="st-table-menu-item"
				@click="lock(false)"
			>
				<i
					class="st-icon"
					:class="{
						'st-icon-check-square st-table-menu-selected': !list[curIdx].locked,
						'st-icon-border': list[curIdx].locked
					}"
				></i>
				<span>不冻结</span>
			</div>
		</div>

		<div v-if="submenu=='column'" class="st-table-menu st-table-submenu">
			<div
				v-for="(item, itemIdx) of list"
				:key="item.text+itemIdx"
				class="st-table-menu-item"
				@click="toggleVisible(itemIdx)"
			>
				<i
					class="st-icon"
					:class="[item.visible?'st-icon-check-square st-table-menu-selected':'st-icon-border']"
				></i>
				<span v-text="item.text"></span>
			</div>
		</div>
	</div>
</template>

<script>
let docEl = document.documentElement;
export default {
	// props: {
	// 	columns: {
	// 		type: Array,
	// 		required: true
	// 	}
	// },
	inject: ['store'],
	
	data(){
		return {
			list: [],
			curIdx: -1,
			visible: false,
			left: -1000,
			top: -1000,
			submenu: ''
		};
	},
	mounted(){
		let self = this;
		this.hide = function(){
			self.visible = false;
			self.store.columns[self.curIdx]._hl = false;
			docEl.removeEventListener('click', self.hide, false);
		};
	},
	methods: {
		show(data){
			if(this.visible) return;
			docEl.removeEventListener('click', this.hide, false);
			let idx = data.column._st_idx;
			let curIdx = -1;
			this.list = this.store.columns.map((item, itemIdx)=>{
				if(item._st_idx == idx){
					curIdx = itemIdx;
				}
				return {
					text: item.text,
					visible: item.visible,
					locked: item.locked
				};
			});
			this.curIdx = curIdx;
			this.visible = true;
			this.submenu = '';

			this.store.columns[this.curIdx]._hl = true;
			this.$nextTick(()=>{
				this.adjust(data.evt);
			});
			setTimeout(()=>{
				docEl.addEventListener('click', this.hide, false);
			}, 1000);
		},
		adjust(evt){
			let tri = evt.target.closest('.st-table-head-th').querySelector('.st-table-head-menu-btn');
			let triRect = tri.getBoundingClientRect();
			let menuRect = this.$el.getBoundingClientRect();
			if(triRect.left + menuRect.width < docEl.clientWidth) {
				this.left = triRect.left;
			} else {
				this.left = triRect.right - menuRect.width;
			}
			this.top = triRect.bottom;
		},
		showSubmenu(type, evt){
			this.submenu = type;
			if(!type) return;
			this.$nextTick(()=>{
				let itemRect = evt.target.closest('.st-table-menu-item').getBoundingClientRect();
				let submenu = this.$el.querySelector('.st-table-submenu');
				let submenuRect = submenu.getBoundingClientRect();
				let boxRect = this.$el.getBoundingClientRect();
				let left = 0;
				let top = 0;
				if(itemRect.right + submenuRect.width < docEl.clientWidth) {
					left = itemRect.width;
				} else {
					left = - submenuRect.width;
				}
				if(itemRect.top + submenuRect.height < docEl.clientHeight) {
					top = itemRect.top - boxRect.top;
				} else {
					top = itemRect.bottom - submenuRect.height - boxRect.top;
				}
				submenu.style.left = left+'px';
				submenu.style.top = top+'px';
			});
		},
		toggleVisible(idx){
			//如果当前可见，并且是唯一可见的列，不能隐藏
			if(this.store.columns[idx].visible) {
				let visibleCount = 0;
				for(let c of this.store.columns){
					if(c.visible)
						visibleCount++;
				}
				if(visibleCount<=1)
					return;
			}
			this.store.columns[idx].visible = !this.store.columns[idx].visible;
			this.list[idx].visible = this.store.columns[idx].visible;
			this.$emit('updatecolumn');

			//todo bug自由区没有列时，列头就不显示了，
		},
		lock(val){
			this.store.columns[this.curIdx].locked = val;
			this.list[this.curIdx] = val;
			this.$emit('updatecolumn');
			this.hide();
		}
	}
};
</script>

<style lang="scss">
.st-table-menu-box{
	position: absolute;
	left: 0;
	top: 0;
	z-index: 100;
}
.st-table-menu{
	box-shadow: rgb(136,136,136) 0 0 6px;
	border: 1px solid #d0d0d0;

	max-height: 300px;
	width: 150px;
	overflow-y: auto;
	background-color: #fff;
	font-size: 12px;
	color: #191919;
	padding: 5px 0;
}
.st-table-menu-item{
	display: flex;
	padding: 5px 7px;
	cursor: pointer;
}
.st-table-menu-item-hover,
.st-table-menu-item:hover{
	background-color: #187ce8;
	color: #fff;
}
.st-table-menu-selected{
	color: #1890ff;
	font-weight: bold;
}
.st-table-menu-item-hover .st-table-menu-selected,
.st-table-menu-item:hover .st-table-menu-selected{
	color: #fff;
}
.st-table-menu-item>span{
	margin-left: 10px;
	flex: 1;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.st-table-menu-title{
	flex: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.st-table-menu-more{
	opacity: 0.8;
	transform: rotate(-90deg);
}
.st-table-submenu{
	position: absolute;
	left: 0;
	top: 0;
}
</style>
