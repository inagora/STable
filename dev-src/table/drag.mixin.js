/**
 * drag拖拽不使用系统原生拖拽的原因？
 * 1、要照顾的事件太多，dragstart/dragover/drop/dragend/dragleave等
 * 2、拖拽图象不灵活，
 * 		1）要么拖拽原始原元的象。拖拽的图象就在鼠标下面，影响对目标位置的判断；
 * 		2）要么通过setDragImage设置canvas图象。虽然可以通过padding，让图片离开
 * 			鼠标一段距离，但canvas图标的绘制也需要开发；另外，这个canvas要想使用，
 * 			必须append到dom中，而且它是从位图中选取一块，注意，不是canvas本身，是canvas所在区域的整体位图，如果这个canvas正好是透明的，它下面又有其它内容，就都会显示出来。
 */
let docEl = document.documentElement;
export default {
	inject: ['store'],
	mounted(){
		this.dragger = {
			startIdx: -1,
			moveFly: this.moveFly.bind(this),
			clearDrag: this.clearDrag.bind(this)
		};
	},
	beforeDestroy(){
		this.clearDrag();
		this.dragger = null;
	},
	methods: {
		prepareDrag(column){
			this.clearDrag();
			this.dragger.startIdx = column._st_idx;
			docEl.addEventListener('mousemove', this.dragger.moveFly, false);
			docEl.addEventListener('mouseup', this.dragger.clearDrag, false);
		},
		initDrag(column){
			let fly = document.createElement('div');
			this.dragger.fly = fly;
			fly.innerText = column.text;
			fly.className = 'st-table-head-drag-fly';
			document.body.appendChild(fly);

			let indicator = document.createElement('div');
			this.dragger.indicator = indicator;
			indicator.innerHTML = '<span class="st-table-head-indicator-top st-iconfont st-icon-arrowdown"></span><span class="st-table-head-indicator-bottom st-iconfont st-icon-arrowdown"></span>';
			indicator.className = 'st-table-head-indicator';
			document.body.appendChild(indicator);

			let els = this.$el.querySelectorAll('.st-table-head-area .st-table-head-th');
			this.columns.forEach((col, idx)=>{
				let rect = els[idx].getBoundingClientRect();
				col.rect = {
					left: rect.left,
					right: rect.right,
					center: (rect.left+rect.right)/2,
					top: rect.top
				};
			});
		},
		moveFly(evt){
			if(this.dragger.fly) {
				let left = evt.clientX;
				if(this.dragger.fly.clientWidth+20+left>docEl.clientWidth){
					left = docEl.clientWidth-20-this.dragger.fly.clientWidth;
				}
				left += docEl.scrollLeft;

				let top = docEl.scrollTop+evt.clientY;
				this.dragger.fly.style.cssText = `left:${left}px;top:${top}px`;
			}
		},
		drag(data){
			if(this.dragger.startIdx < 0)
				return;
			let {column, evt} = data;
			if(!this.dragger.fly)
				this.initDrag(column);
			
			let {valid, pos, rect} = this.dropValidCheck(column, evt);
			if(valid){
				let left = pos=='before'?rect.left:rect.right;
				left += docEl.scrollLeft;
				let top = rect.top + docEl.scrollTop;
				this.dragger.indicator.style.cssText = `left:${left}px;top:${top}px`;
			} else
				this.dragger.indicator.style.cssText = `left:-1000px;top:-1000px`;
		},
		dropValidCheck(column, evt){
			if(this.dragger.startIdx < 0 || !this.dragger.fly)
				return {valid: false};
			let startIdx = this.dragger.startIdx;
			let targetIdx = column._st_idx;
			let rect = column.rect;
			let startColumn = this.columns[startIdx];
			let pos = evt.clientX<rect.center ? 'before':'after';
			let valid = false;
			if(targetIdx > startIdx) {
				if(column.locked != startColumn.locked) {
					valid = true;
				} else {
					if(targetIdx-startIdx == 1) {
						if(column.type != 'pad' && pos == 'after')
							valid = true;
					} else {
						valid = true;
					}
				}
			} else if(targetIdx < startIdx) {
				if(column.locked != startColumn.locked) {
					valid = true;
				} else {
					if(targetIdx-startIdx == -1) {
						if(pos == 'before')
							valid = true;
					} else 
						valid = true;
				}
			}
			return {
				valid,
				pos,
				rect,
				startIdx,
				targetIdx
			}
		},
		drop(data){
			if(this.dragger.startIdx < 0)
				return;
			let {column, evt} = data;
			let {valid, pos, rect, startIdx, targetIdx} = this.dropValidCheck(column, evt);
			if(valid) {
				//store.column的修改，会引起formatColumn()
				let startColumn = this.columns[startIdx];
				startColumn.locked = column.locked;
				this.store.columns.sort((c0, c1)=>c0._st_idx-c1._st_idx);
				let cs = [];
				for(let c of this.store.columns) {
					if(c._st_idx == startIdx) continue;
					if(c._st_idx == targetIdx) {
						if(pos == 'before')
							cs.push(startColumn);
						cs.push(c);
						if(pos == 'after')
							cs.push(startColumn);
					} else {
						cs.push(c);
					}
				}
				this.store.columns = cs;
			}
		},
		clearDrag(){
			this.dragger.startIdx = -1;
			if(this.dragger.fly){
				this.dragger.fly.remove();
				this.dragger.fly = null;
			}
			if(this.dragger.indicator){
				this.dragger.indicator.remove();
				this.dragger.indicator = null;
			}
			docEl.removeEventListener('drag', this.dragger.moveFly, false);
			docEl.removeEventListener('mouseup', this.dragger.clearDrag, false);
		}
	},
	provide(){
		let self = this;
		let dragger = {
			startIdx: -1
		};

		function clearDrag(){
			
		}

	
		dragger.clearDrag = clearDrag;
		return {dragger};
	}
}