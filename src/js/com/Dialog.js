function formatArgs(msg,title, options) {
	let conf = {
		message: msg||'',
		title: '提示',
		options: {}
	};
	if(title) {
		if(typeof title == 'string') {
			conf.title = title;
			conf.options = Object.assign({}, options);
		} else {
			conf.options = title;
			conf.title = conf.options.title||conf.title;
		}
	}
	return conf;
}
let Dialog={
	qtip(msg, type, options){
		let conf = {};
		if(type) {
			if(typeof type=='string') {
				conf = Object.assign({type},options);
			} else {
				conf = type;
			}
		}
		conf.message = msg;
		Vue.prototype.$message(conf);
	},
	alert(msg, title, options){
		let conf = formatArgs(msg, title, options);
		conf.options.callback = conf.options.fn||function(){};
		
		Vue.prototype.$alert(conf.message, conf.title, conf.options);
	},
	confirm(msg, title, options){
		let conf = formatArgs(msg, title, options);
		if(conf.options.fn) {
			conf.options.callback = function(action){
				conf.options.fn(action=='confirm'?'yes':'no');
			};
		}
		Vue.prototype.$confirm(conf.message, conf.title, conf.options);
	},
	prompt(msg, title, options){
		let conf = formatArgs(msg, title, options);
		let p = Vue.prototype.$prompt(conf.message, conf.title, conf.options);
		if(conf.options.fn){
			p.then(({value})=>{
				conf.options.fn(value);
			}).catch(()=>{});
		} else {
			return p;
		}
	},
	create(config){
		let el = document.createElement('div');
		document.body.appendChild(el);
		let dialogConfigKeys = [
			'title',
			'width',
			'height',
			'bodyCls',
			'bodyStyle',
			'autoShow',
			'closable',
			'closeAction',
			'listeners',
			'modal',
			'buttons',
			'contentEl',
			'html'
		];
		let dialogConfig = {};
		dialogConfigKeys.forEach(key=>{
			if(config.hasOwnProperty(key)) {
				dialogConfig[key] = config[key];
				delete config[key];
			}
		});
		config.provide = {config: dialogConfig};
		config.methods = Object.assign(config.methods||{}, {
			close(){
				this.$refs.dialog.close();
			},
			show(){
				this.$refs.dialog.show();
			}
		});
		config.template = `<x-dialog ref="dialog">${dialogConfig.html||''}</x-dialog>`;
		let dia = new Vue(config).$mount(el);
		dia.element = dia.$el;
		return dia;
	}
};

export default Dialog;