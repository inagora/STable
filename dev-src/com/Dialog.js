import XDialog from './Dialog.vue';

function formatArgs(msg, title, options){
	if(msg && typeof msg != 'string')
		return msg;
	if(title && typeof title != 'string'){
		options = title;
		options.msg = msg;
		return options;
	}
	if(!options){
		options = {};
	}
	options.title = title||'提示';
	options.msg = msg||'';
	return options;
}
export function alert(msg, title, options){
	let config = formatArgs(msg, title, options);
}
export function create(config) {
	let el = document.createElement('div');
	document.body.appendChild(el);
	let dialogConfigKeys = [
		'title',
		'width',
		'height',
		'bodyCls',
		'bodyStyle',
		'autoShow',
		'autoOpen',
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
	let methods = {
		prop(...args){
			if(args.length<=0) return {};
			let data;
			if(args.length==1) {
				if(typeof args[0]=='string')
					return this.$refs.dialog[args[0]];
				else {
					data = args[0];
				}
			} else if(args.length>=2) {
				if(typeof args[0]=='string') {
					data = {};
					data[args[0]] = args[1];
				}
			}
			if(data) {
				for(let key in data) {
					this.$refs.dialog[key] = data[key];
				}
			}
		},
		_trigger(evtName){
			let listeners = dialogConfig.listeners||{};
			if(listeners[evtName]) {
				return listeners[evtName].call(this);
			}
		},
		show(){
			let ret = this._trigger('beforeshow');
			if(ret !== false){
				this.$refs.dialog.visible = true;
				this._trigger('show');
			}
			return ret;
		},
		hide(){
			let ret = this._trigger('beforehide');
			if(ret !== false){
				this.$refs.dialog.visible = false;
				this._trigger('hide');
			}
			return ret;
		},
		destroy(){
			let ret = this._trigger('beforedestroy');
			if(ret !== false) {
				this.$destroy();
				this.$el.remove();
				this._trigger('destroy');
			}
			return ret;
		},
		open(){
			this.show();
		},
		close(){
			let ret = this._trigger('beforeclose');
			if(ret !== false)
				ret = this.hide();
			if(ret !== false){
				if(this.$refs.dialog.closeAction != 'hide')
					ret = this.destroy();
			}
			return ret;
		}
	};
	for(let name in methods) {
		if(typeof config.methods == 'undefined')
			config.methods = {};
		if(config.methods[name]){
			alert(`dialog的methods里请不要声明 ${name} 方法`);
			return null;
		}
		config.methods[name] = methods[name];
	}
	let dia = new Vue(Object.assign(config, {
		provide: {dialogConfig},
		template: `<x-dialog @close="close" ref="dialog">${dialogConfig.html||''}</x-dialog>`,
		components: {XDialog}
	})).$mount(el);
	if(window.$ && (window.$==window.jQuery||window.$==window.Zepto))
		dia.element = window.$(dia.$el);
	return dia;
}