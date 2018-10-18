export default {
	data(){
		return {
			insertIndicator: false,
			insertPosition: 0
		};
	},
	methods: {
		dragstart({colIdx, evt}){
			evt.dataTransfer.dropEffect = "move";
			let lockedEls = this.$el.querySelectorAll('.st-table-locked-head .st-table-th');
			let freeEls = this.$el.querySelectorAll('.st-table-free-head .st-table-th');
			lockedEls = Array.prototype.slice.call(lockedEls);
			freeEls = Array.prototype.slice.call(freeEls);
			let els = lockedEls.concat(freeEls.slice(lockedEls.length));

			let columnRectList = [];

			for(let i=0,len=els.length;i<len;i++) {
				let type = this.columns[i].type;
				if(['rownumber', 'pad', 'radio', 'checkbox'].includes(type)){
					columnRectList.push({});
				} else {
					let rect = els[i].getBoundingClientRect();
					columnRectList.push({
						center:(rect.left+rect.right)/2,
						left: rect.left,
						right: rect.right
					});
				}
			}
			let rect = this.$el.querySelector('.st-table-head-box').getBoundingClientRect();
			this.boxLeft = rect.left;
			this.startIdx = colIdx;
			this.columnRectList = columnRectList;
		},
		dragover({colIdx,evt}){
			evt.preventDefault();
			let targetPos,
				startIdx = this.startIdx,
				colType = this.columns[colIdx].type;
			if(colIdx == startIdx || ['rownumber', 'pad', 'radio', 'checkbox'].includes(colType)){
				//evt.dataTransfer.dropEffect = "null";
			} else if(startIdx>colIdx) {	//从右往左移
				//从右侧非锁定区移到左侧锁定区
				if(this.columns[startIdx].locked != this.columns[colIdx].locked) {
					if(evt.clientX < this.columnRectList[colIdx].center) {
						targetPos = 'before';
					} else {
						targetPos = 'after';
					}
				} else {
					if(evt.clientX < this.columnRectList[colIdx].center) {
						targetPos = 'before';
					} else {
						//向相挨的列移动，并且在右半边时，不满足移动条件
						//隔开的列可以移动
						if(colIdx+1!=startIdx) {
							targetPos = 'after';
						}
					}
				}
			} else {	//从左往右移
				//从锁定区往自由区移动
				if(this.columns[startIdx].locked != this.columns[colIdx].locked) {
					if(evt.clientX < this.columnRectList[colIdx].center) {
						targetPos = 'before';
					} else {
						targetPos = 'after';
					}
				} else {
					if(evt.clientX < this.columnRectList[colIdx].center) {
						if(startIdx+1!=colIdx){
							targetPos = 'before';
						}
					} else {
						targetPos = 'after';
					}
				}
			}
			if(targetPos) {
				this.insertIndicator = true;
				let pos = (targetPos=='before') ? this.columnRectList[colIdx].left : this.columnRectList[colIdx].right;
				this.insertPosition = pos - this.boxLeft;

				this.targetIdx = colIdx;
				this.targetPos = targetPos;
			} else {
				this.insertIndicator = false;
			}
			evt.dataTransfer.dropEffect = targetPos ? "copy":'none';
		},
		drop(evt){
			evt.preventDefault();
			if(this.insertIndicator) {
				let startIdx = this.columns[this.startIdx]._st_idx,
					targetIdx = this.columns[this.targetIdx]._st_idx;

				let columns = this.store.columns;
				columns[startIdx].locked = columns[targetIdx].locked;
				let startColumn = columns.splice(startIdx, 1);
				if(startIdx > targetIdx) {
					columns.splice(
						this.targetPos=='before'? targetIdx : (targetIdx+1),
						0,
						startColumn[0]
					);
				} else {
					columns.splice(
						this.targetPos=='before'? (targetIdx-1) : targetIdx,
						0,
						startColumn[0]
					);
				}
				columns.forEach((col, idx)=>{
					col._st_idx = idx;
				});

				this.store.saveColumnsState();
			}
			
			this.insertIndicator = false;
		},
		dragend(){
			this.insertIndicator = false;
		},
		dragleave(){
			this.insertIndicator = false;
		}
	}
};