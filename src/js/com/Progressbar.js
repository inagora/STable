import XProgressbar from "./Progressbar.vue";

const Progressbar = {
	create(config){
		if(typeof config == 'string') {
			config = {
				type: config
			};
		}
		config = Object.assign({
			type:'',
			autoShow: true,
			value: 0,
			text: ''
		}, config);
		let el = document.createElement('div');
		document.body.appendChild(el);
		let app = new Vue({
			data: {
				visible: config.autoShow,
				val: config.value,
				text: config.text,
				type: config.type
			},
			template: '<x-progressbar :visible="visible" :val="val" :text="text" :type="type"></x-progressbar>',
			components: {XProgressbar},
			methods: {
				update(value, text){
					this.val = value;
					this.text = text;
					return this;
				},
				show(){
					this.visible = true;
					return this;
				},
				hide(){
					this.visible = false;
					return this;
				},
				destroy(){
					this.visible = false;
					let el = this.$el;
					this.$destroy();
					el.remove();
				}
			}
		}).$mount(el);

		return app;
	}
};
export default Progressbar;