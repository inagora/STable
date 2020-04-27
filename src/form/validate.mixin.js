import { $type } from '../util/util';
export default {
	methods: {
		formatRule(){
			let rules = (this.field.rules||[]).slice(0);
			let type = this.field.type;
			if($type(this.field.min)!='undefined') {
				if(!rules.some(r=>$type(r.min)!='undefined')){
					let rule = {
						min: this.field.min,
						trigger: 'blur'
					};
					if(type=='number') {
						rule.message = '数字不能小于'+this.field.min;
					} else if (type=='multiple'){
						rule.message = '最少选择'+this.field.min+'项';
					} else {
						rule.message = '输入不能少于'+this.field.min+'个字符';
					}
					rules.push(rule);
				}
			}
			if($type(this.field.max)!='undefined') {
				if(!rules.some(r=>$type(r.max)!='undefined')){
					let rule = {
						max: this.field.max,
						trigger: 'blur'
					};
					if(type=='number') {
						rule.message = '数字不能大于'+this.field.max;
					} else if (type=='multiple'){
						rule.message = '最多选择'+this.field.max+'项';
					} else {
						rule.message = '输入不能多于'+this.field.max+'个字符';
					}
					rules.push(rule);
				}
			}
			if(this.field.required) {
				if(!rules.some(r=>$type(r.required)!='undefined')){
					let rule = {
						required: true,
						trigger: 'blur'
					};
					if(type=='date'){
						rule.message = '请选择日期';
					} else if(type=='datetime'){
						rule.message = '请选择时间';
					} else if(['select','combobox','cascader','multiple'].includes(type)){
						rule.message = '请选择'+this.field.label;
					} else {
						rule.message = '请填写'+this.field.label;
					}
					rules.push(rule);
				}
			}
			if(this.field.length) {
				let rule = {
					length: this.field.length,
					trigger: 'blur'
				};
				if(type=='text'){
					rule.message = '请输入符合要求长度的内容';
				} else if(type=='multiple'){
					rule.message = '请选择符合要求长度的选项个数';
				}
				rules.push(rule);
			}
			if(this.field.pattern) {
				let pattern = this.field.pattern;
				if($type(pattern)=='string'){
					pattern = new RegExp('^'+pattern+'$');
				}
				let rule = {
					pattern,
					message: '请与所要求的格式保持一致',
					trigger: 'blur'
				};
				rules.push(rule);
			}
			if(type=='number'){
				if(!rules.some(r=>$type(r.pattern)!='undefined')) {
					let rule = {
						pattern: /^-?(\d+\.?|\d*\.\d+)+$/,
						message: '请填入数字',
						trigger: 'blur'
					};
					rules.push(rule);
				}
			}
			this.rules = rules;
		},
		validate(justChange){
			let type = this.field.type;
			let errmsg = '';
			for(let rule of this.rules){
				if(justChange && rule.trigger!='change')
					continue;
				if(rule.validator){
					if(!rule.validator(rule, this.value)){
						errmsg = rule.message;
						break;
					}
				}
				if($type(rule.min)!='undefined') {
					if(type=='number'){
						if(parseFloat(this.value)<rule.min){
							errmsg = rule.message;
							break;
						}
					} else if (type=='multiple'){
						if(this.value.length<rule.min){
							errmsg = rule.message;
							break;
						}
					} else {
						if(this.value.length<rule.min){
							errmsg = rule.message;
							break;
						}
					}
				}
				if($type(rule.max)!='undefined') {
					if(type=='number'){
						if(parseFloat(this.value)>rule.max){
							errmsg = rule.message;
							break;
						}
					} else if (type=='multiple'){
						if(this.value.length>rule.max){
							errmsg = rule.message;
							break;
						}
					} else {
						if(this.value.length>rule.max){
							errmsg = rule.message;
							break;
						}
					}
				}
				if($type(rule.length)!='undefined') {
					if(this.value.length != rule.length) {
						errmsg = rule.message;
						break;
					}
				}
				if(this.field.required) {
					if(['date', 'datetime','text','select', 'combobox'].includes(type)){
						if(this.value===''){
							errmsg = rule.message;
							break;
						}
					} else if(['cascader','multiple'].includes(type)){
						if(this.value.length<=0){
							errmsg = rule.message;
							break;
						}
					}
				}
				if($type(this.value)=='string' && rule.pattern &&  !rule.pattern.test(this.value)){
					errmsg = rule.message;
					break;
				}
				
			}
			this.$emit('update:errmsg', errmsg);
			if(errmsg)
				return false;
			else 
				return true;
		}
	}
};