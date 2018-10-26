import Vue from 'vue';
import {version, init} from './index.js';
import {
	Button,
	Tag,
	Form,
	FormItem,
	Input,
	DatePicker,
	TimePicker,
	Select,
	Option,
	Pagination,
	Tooltip
} from 'element-ui';
Vue.use(Button);
Vue.use(Tag);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Select);
Vue.use(Option);
Vue.use(Pagination);
Vue.use(Tooltip);

require('../css/font-awesome.css');

if(!window.Vue)
	window.Vue = Vue;
window.STable = {
	version,
	init
};