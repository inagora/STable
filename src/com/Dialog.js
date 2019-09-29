import XDialog from './Dialog.vue';
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
		if(Object.prototype.hasOwnProperty.call(config, key)) {
			dialogConfig[key] = config[key];
			delete config[key];
		}
	});
	let methods = {
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
			if(ret !== false)
				this._trigger('close');
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
	if(!config.mounted){
		config.mounted = function(){
			this._trigger('ready');
		};
	}
	let dia = new Vue(Object.assign(config, {
		provide: {dialogConfig},
		template: `<x-dialog @close="close" ref="dialog">${dialogConfig.html||''}</x-dialog>`,
		components: {XDialog}
	})).$mount(el);
	return dia;
}