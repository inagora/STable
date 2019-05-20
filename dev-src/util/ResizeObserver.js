class ResizeObserver{
	constructor(cb){
		this._nodes = [];
		this._cb = cb;
		this._sizes = [];
		this._timer = null;
	}
	_t(){
		this._timer = null;
		if(this._nodes.length<=0) return;

		let entries = [];
		for(let i=0,len=this._nodes.length;i<len;i++){
			let node = this._nodes[i];
			let rect = node.getBoundingClientRect();
			let oldSize = this._sizes[i];
			if(rect.width!=oldSize.width || rect.height!=oldSize.height) {
				entries.push({
					target: node,
					contentRect: {
						width: rect.width,
						height: rect.height
					}
				});
				oldSize.width = rect.width;
				oldSize.height = rect.height;
			}
		}
		if(entries.length>0)
			this._cb(entries);
		
		this._timer = setTimeout(()=>{
			this._t();
		}, 500);
		
	}
	observe(node){
		this._nodes.push(node);
		let rect = node.getBoundingClientRect();
		this._sizes.push({
			width: rect.width,
			height: rect.height
		});
		if(this._timer)
			clearTimeout(this._timer);
		this._t();
	}
	unobserve(node){
		let idx = this._nodes.indexOf(node);
		if(idx>=0) {
			this._nodes.splice(idx, 1);
			this._sizes.splice(idx, 1);
		}
	}
	disconnect(){
		this._nodes = [];
		this._sizes = [];
	}
}

let ret = window.ResizeObserver||ResizeObserver;
export default ret;