let docEl = document.documentElement;
export default {
	data(){
		return {
			resizing: false,
			startResizePos: 0,
			endResizePos: 0,
		};
	},
	mounted(){
		this._resize = this.resize.bind(this);
		this._resizeEnd = this.resizeEnd.bind(this);
	},
	methods: {
		startResize(data){
			this.clearResize();
			data.evt.preventDefault();
			let rect = data.evt.target.closest('.st-table-head-th').getBoundingClientRect();
			let boxRect = this.$el.querySelector('.st-table-head-area').getBoundingClientRect();
			this.resizing = true;
			this.startResizePos = rect.left - boxRect.left;
			this.endResizePos = rect.right - boxRect.left;
			this._headBoxLeft = boxRect.left;
			this._resizeColumnIdx = data.column._st_idx;

			docEl.addEventListener('mousemove', this._resize, false);
			docEl.addEventListener('mouseup', this._resizeEnd, false);
		},
		resize(evt){
			let pos = evt.clientX - this._headBoxLeft;
			if(pos-this.startResizePos < 25)
				pos = this.startResizePos+25;
			this.endResizePos = pos;
		},
		resizeEnd(){
			this.clearResize();
			let resizingIdx = this.columns[this._resizeColumnIdx]._st_idx;
			let cs = this.store.columns.map(col=>{
				if(col._st_idx == resizingIdx){
					col.width = this.endResizePos - this.startResizePos;
				}
				return col;
			});
			this.store.columns = cs;
			this._syncHeight();
		},
		clearResize(){
			this.resizing = false;
			docEl.removeEventListener('mousemove', this._resize, false);
			docEl.removeEventListener('mouseup', this._resizeEnd, false);
		}
	}
};