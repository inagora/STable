import Vue from 'vue';
import XProgressbar from "./Progressbar.vue";

const Progressbar = {
	create(){
		let app = new Vue({
			data: {
				visible: false,
				val: 0,
				text: ''
			},
			template: '<x-progressbar :visible="visible" :val="val" :text="text"></x-progressbar>',
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
				}
			}
		}).$mount(document.body);

		return app;
	}
};
export default Progressbar;