import Vue from 'vue';
import XProgressbar from "./Progressbar.vue";

const Progressbar = {
	create(type=''){
		let el = document.createElement('div');
		document.body.appendChild(el);
		let app = new Vue({
			data: {
				visible: false,
				val: 0,
				text: '',
				type
			},
			template: '<x-progressbar :visible="visible" :val="val" :text="text" :type="type"></x-progressbar>',
			components: {XProgressbar},
			methods: {
				update(value, text){
					this.val = value;
					this.text = text;
				},
				show(){
					this.visible = true;
				},
				hide(){
					this.visible = false;
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