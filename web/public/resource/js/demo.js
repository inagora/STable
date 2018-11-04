/* global fetch CodeMirror  */
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
			demoVer: {}
		}
	},
	mounted() {
		let conf = storage.getItem(CONFIG_KEY);
		try {
			if (conf) {
				conf = JSON.parse(conf);
				let demoVer = conf.demoVer;
				this.navList.forEach(nav => {
					let key = nav[1];
					if (demoVer[key]) {
						if (demoVer[key] != nav[2]) {
							delete demoVer[key];
						}
					}
				});
				this.conf = conf;
			}
		} catch (e) {
			//e
		}
		let params = new window.URLSearchParams(window.location.search.substr(1));
		let demo = params.get('demo');
		if (demo && this.navList.filter(item => item[1] == demo).length > 0) {
			this.conf.curDemo = demo;
		} else {
			this.conf.curDemo = this.navList[0][1];
		}

		this.showDemo(['', this.conf.curDemo]);
	},
	watch: {
		conf: {
			handler(val) {
				storage.setItem(CONFIG_KEY, JSON.stringify(val));
			},
			deep: true
		},
		activeEditor() {
			setTimeout(()=>{
				this.changeEditor();
			}, 40);
		}
	},
	methods: {
		loadDemo() {
			let demo = this.conf.curDemo;
			let p;
			if (!this.conf.demoVer[demo]) {
				p = new Promise(resolve => {
					fetch('/demo/ajaxGetDemo/' + demo)
						.then(res => {
							return res.json();
						}).then(res=>{
							resolve(res);
							let ver = 0;
							for (let nav of this.navList) {
								if (nav[1] == demo) {
									ver = nav[2];
									break;
								}
							}

							this.$set(this.conf.demoVer, demo, ver);
							demos[demo] = res;
							storage.setItem(DEMO_PREFIX + demo, JSON.stringify(res));
						});
				});
			} else if (demos[demo]) {
				p = Promise.resolve(demos[demo]);
			} else {
				let res = JSON.parse(storage.getItem(DEMO_PREFIX + demo));
				demos[demo] = res;
				p = Promise.resolve(res);
			}
			return p;
		},
		showDemo(nav) {
			this.conf.curDemo = nav[1];
			this.loadDemo().then(res=>{
				this.changeEditor();
				if(this.styleEl)
					this.styleEl.remove();
				let style = document.createElement('style');
				style.type = "text/css";
				style.appendChild(document.createTextNode(res.css));
				document.head.appendChild(style);
				this.styleEl = style;

				if(this.htmlEl)
					this.htmlEl.remove();
				let html = document.createElement('div');
				html.innerHTML = res.html;
				document.body.appendChild(html);
				this.htmlEl = html;

				if(this.jsEl){
					this.jsEl.remove();
				}
				let script = document.createElement('script');
				script.type = 'text/javascript';
				script.text = '(function(){'+res.js+'})()';
				document.body.appendChild(script);
				this.jsEl = script;
			});
		},
		changeEditor() {
			let source = demos[this.conf.curDemo];
			if(!this.editor[this.activeEditor]) {
				let mode=  {js:'javascript', css:'css',html: 'xml'}[this.activeEditor];
				
				this.editor[this.activeEditor] = CodeMirror(document.getElementById(this.activeEditor+'Editor'), {
					mode,
					theme: "monokai",
					lineNumbers: true,
					indentWithTabs: true,
				});
			}
			this.editor[this.activeEditor].setValue(source[this.activeEditor]);
			let rect = document.querySelector('#editor').getBoundingClientRect();
			this.editor[this.activeEditor].setSize(rect.width,rect.height);
		},
		run() {
			let source = {};
			['js', 'css', 'html'].forEach(type => {
				source[type] = this.editor[type] ? this.editor[type].getValue() : demos[this.conf.curDemo][type];
			});
			storage.setItem(DEMO_PREFIX + this.conf.curDemo, JSON.stringify(source));
			console.log(source)
			demos[this.conf.curDemo] = source;
			this.loadDemo();
		},
		clear() {
			if (confirm('确认要清除对这个demo的修改，加载原始的demo')) {
				let demo = this.conf.curDemo;
				delete this.conf.demoVer[demo];
				this.conf.demoVer = Object.assign({}, this.conf.demoVer);
				storage.removeItem(DEMO_PREFIX + demo);
				window.location.reload();
			}
		},
		clearAll() {
			if (confirm('确认要清除对所有demo的修改，加载原始的demo')) {
				this.conf.demoVer = {};
				window.location.reload();
			}
		}
	}
});