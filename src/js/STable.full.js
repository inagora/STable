import Vue from 'vue';
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
	Tooltip,
	MessageBox,
	Message,
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
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;

require('../css/font-awesome.css');

if(!window.Vue)
	window.Vue = Vue;
let {version, init} = require('./index.js');
window.STable = {
	version,
	init
};