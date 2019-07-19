import XSidePanel from './SidePanel.vue';
class SidePanel {
	constructor(){
		let self = this;
		this.app = new Vue({
			components: {XSidePanel},
			data:{
				title: '',
				visible: false,
				html: '',
				isPage: false
			},
			methods: {
				hide(){
					if(self == SidePanel._ins) {
						SidePanel.hide();
					} else 
						self.hide();
				}
			},
			template: 
				'<x-side-panel'
					+ ' :visible="visible"'
					+ ' :title="title"'
					+ ' :html="html"'
					+ ' :is-page="isPage"'
					+ ' @close="hide">'
				+ '</x-side-panel>'
		});
	}
	init(){
		if(this.inited) return;
		let el = document.createElement('div');
		document.body.appendChild(el);
		this.app.$mount(el);
		this.inited = true;
	}
	show(content, title, options){
		this.init();
		if(typeof title=='string') {
			options = Object.assign(options||{}, {title});
		} else {
			options = title;
		}
		if(!options)
			options = {};
		if(/^https?:\/\//.test(content)){
			this.showPage(content, options);
		} else {
			this._options = options;
			this.app.html = content;
			this.app.visible = true;
			this.app.isPage = false;
			this.app.title = options.title||'';
			if(this._options.listeners && this._options.listeners.show) {
				this._options.listeners.show.call(this.app);
			}
		}
	}
	showPage(url, title, options) {
		this.init();
		if(typeof title=='string') {
			options = Object.assign(options||{}, {title});
		} else {
			options = title;
		}
		if(!options)
			options = {};
		this._options = options;
		this.app.html = url;
		this.app.visible = true;
		this.app.isPage = true;
		this.app.title = options.title||'';
		if(this._options.listeners && this._options.listeners.show) {
			this._options.listeners.show.call(this.app);
		}
	}
	hide(){
		if(this._options.listeners && this._options.listeners.beforehide) {
			let ret = this._options.listeners.beforehide.call(this.app);
			if(ret===false)
				return;
		}

		this.app.visible = false;
		if(this.app.isPage) {
			this.app.html = "about:blank";
		} else {
			this.app.html = '';
		}
		if(this._options.listeners && this._options.listeners.hide) {
			this._options.listeners.hide.call(this.app);
		}
	}
	destroy(){
		this._options = null;
		let el = this.app.$el;
		this.app.$destroy();
		el.remove();
		this.app = null;
	}

	static show(content, title, options){
		if(!this._ins){
			this._ins = new SidePanel();
		}
		this._ins.show(content, title, options);
	}
	static showPage(url, title, options) {
		if(!this._ins) {
			this._ins = new SidePanel();
		}
		this._ins.showPage(url, title, options);
	}
	static hide(){
		if(this._ins){
			this._ins.hide();
			this._ins.destroy();
		}
		this._ins = null;
	}
}
export default SidePanel;