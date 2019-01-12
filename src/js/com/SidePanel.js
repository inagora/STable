import SidePanel from './SidePanel.vue';
let app = new Vue({
	data:{
		title: '',
		visible: false,
		html: '',
		isPage: false
	},
	components: {SidePanel},
	template: 
		'<side-panel'
			+ ' :visible="visible"'
			+ ' :title="title"'
			+ ' :html="html"'
			+ ' :is-page="isPage"'
			+ ' @close="hide">'
		+ '</side-panel>',
	methods: {
		init(){
			if(this.inited) return;
			let el = document.createElement('div');
			document.body.appendChild(el);
			this.$mount(el);
			this.inited = true;
		},
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
			this.html = url;
			this.visible = true;
			this.isPage = true;
			this.title = options.title||'';
			if(this._options.listeners && this._options.listeners.show) {
				this._options.listeners.show.call(this);
			}
		},
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
				this.html = content;
				this.visible = true;
				this.isPage = false;
				this.title = options.title||'';
				if(this._options.listeners && this._options.listeners.show) {
					this._options.listeners.show.call(this);
				}
			}
		},
		hide() {
			if(this._options.listeners && this._options.listeners.beforehide) {
				let ret = this._options.listeners.beforehide.call(this);
				if(ret===false)
					return;
			}

			this.visible = false;
			if(this.isPage) {
				this.html = "about:blank";
			} else {
				this.html = '';
			}
			if(this._options.listeners && this._options.listeners.hide) {
				this._options.listeners.hide.call(this);
			}
		}
	}
});
export default app;