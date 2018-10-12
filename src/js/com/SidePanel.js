import SidePanel from './SidePanel.vue';
let app = new Vue({
	data:{
		title: '',
		visible: false,
		html: '',
		isPage: false
	},
	components: {SidePanel},
	template: `
		<side-panel
			:visible="visible"
			:title="title"
			:html="html"
			:is-page="isPage"
			@close="visible=false">
		</side-panel>`,
	methods: {
		init(){
			if(this.inited) return;
			let el = document.createElement('div');
			document.body.appendChild(el);
			this.$mount(el);
			this.inited = true;
		},
		showPage(url, options) {
			this.init();
			if(typeof options=='string') {
				if(arguments.length>=3){
					options = Object.assign(arguments[2]||{},{title:options});
				}else {
					options = {title: options};
				}
			}
			if(!options)
				options = {};
			this.html = url;
			this.visible = true;
			this.isPage = true;
			this.title = options.title||'';
		},
		show(content, options){
			this.init();
			if(typeof options=='string') {
				if(arguments.length>=3){
					options = Object.assign(arguments[2]||{},{title:options});
				}else {
					options = {title: options};
				}
			}
			if(!options)
				options = {};
			if(/^https?:\/\//.test(content)){
				this.showPage(content, options);
			} else {
				this.html = content;
				this.visible = true;
				this.isPage = false;
				this.title = options.title||'';
			}
		},
		hide() {
			this.visible = false;
			if(this.isPage) {
				this.html = "about:blank";
			} else {
				this.html = '';
			}
		}
	}
});
export default app;