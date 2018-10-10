let storage = window.localStorage;
const CONFIG_KEY = 'STABLE_DEMO_CONFIG';
const DEMO_PREFIX = 'STABLE_DEMO_ITEM_';
let demos = {};
new Vue({
	el: '#doc',
	data: {
		navList: window.navList,
		editor: {},
		layoutList: [
			'1:0', '3:1', '2:1', '1:1', '1:2', '1:3'
		],
		activeEditor: 'js',
		conf: {
			layout: '3:1',
			curDemo: '',
			demoVer:{}
		}
	},
	mounted(){
		let conf = storage.getItem(CONFIG_KEY);
		try{
			if(conf) {
				conf = JSON.parse(conf);
				let demoVer = conf.demoVer;
				this.navList.forEach(nav=>{
					let key = nav[1];
					if(demoVer[key]) {
						if(demoVer[key] != nav[2]) {
							delete demoVer[key];
						}
					}
				});
				this.conf = conf;
			}
		}catch(e){
			//e
		}
		let params = new window.URLSearchParams(window.location.search.substr(1));
		let demo = params.get('demo');
		if(demo && this.navList.filter(item=>item[1]==demo).length>0) {
			this.conf.curDemo = demo;
		} else {
			this.conf.curDemo = this.navList[0][1];
		}

		window.addEventListener('message', evt=>{
			switch(evt.data){
				case 'playground-ready':
					this.loadDemo();
					break;
				case 'js-ready':
					this.editor.js = document.getElementById('jsEditor').contentWindow;
					if(this.activeEditor=='js')
						this.changeEditor();
					break;
				case 'css-ready':
					this.editor.css = document.getElementById('cssEditor').contentWindow;
					if(this.activeEditor=='css')
						this.changeEditor();
					break;
				case 'html-ready':
					this.editor.html = document.getElementById('htmlEditor').contentWindow;
					if(this.activeEditor=='html')
						this.changeEditor();
					break;
			} 
		}, false);
		let iframe = document.querySelector('#app iframe');
		iframe.setAttribute('src', iframe.getAttribute('data-src'));
		this.playground = iframe.contentWindow;
	},
	watch: {
		conf:{
			handler(val){
				storage.setItem(CONFIG_KEY, JSON.stringify(val));
			},
			deep: true
		},
		activeEditor() {
			this.changeEditor();
		}
	},
	methods: {
		loadDemo() {
			let demo = this.conf.curDemo;
			let p;
			if(!this.conf.demoVer[demo]) {
				p = new Promise(resolve=>{
					$.get('/ajaxGetDemo/'+demo,res=>{
						resolve(res);
						let ver = 0;
						for(let nav of this.navList) {
							if(nav[1]==demo){
								ver = nav[2];
								break;
							}
						}
						
						this.$set(this.conf.demoVer, demo, ver);
						demos[demo] = res;
						storage.setItem(DEMO_PREFIX+demo, JSON.stringify(res));
					},'json');
				});
			} else if(demos[demo]){
				p = Promise.resolve(demos[demo]);
			} else {
				let res = JSON.parse(storage.getItem(DEMO_PREFIX+demo));
				demos[demo] = res;
				p = Promise.resolve(res);
			}
			p.then(res=>{
				this.playground.postMessage(res, window.location.origin);
				this.changeEditor();
			});
		},
		showDemo(nav) {
			this.conf.curDemo = nav[1];
			this.playground.location.reload();
		},
		changeEditor() {
			let source = demos[this.conf.curDemo];
			
			if(source && this.editor[this.activeEditor]) {
				this.editor[this.activeEditor].postMessage(source[this.activeEditor], window.location.origin);
			}
		},
		run() {
			let source = {};
			['js', 'css', 'html'].forEach(type=>{
				source[type] = this.editor[type].cm ? this.editor[type].cm.getValue() : demos[this.conf.curDemo][type];
			});
			storage.setItem(DEMO_PREFIX+this.conf.curDemo, JSON.stringify(source));
			demos[this.conf.curDemo] = source;
			this.playground.location.reload();
		},
		clear(){
			if(confirm('确认要清除对这个demo的修改，加载原始的demo')){
				let demo = this.conf.curDemo;
				delete this.conf.demoVer[demo];
				this.conf.demoVer = Object.assign({}, this.conf.demoVer);
				storage.removeItem(DEMO_PREFIX+demo);
				window.location.reload();
			}
		},
		clearAll() {
			if(confirm('确认要清除对所有demo的修改，加载原始的demo')){
				this.conf.demoVer = {};
				window.location.reload();
			}
		}
	}
});