<template>
	<input
		v-model="val"
		:type="field.nativeType||'text'"
		:name="field.name"
		:placeholder="field.placeholder"
		class="st-form-input"
		@focus="$emit('fieldfocus')"
		@blur="$emit('fieldblur');validate()"
		@input="validate(true)"
		@change="handleChange(field, $event)"
	/>
</template>

<script>
import { loadJs, loadCss, $type } from '../util/util';
import validate from './validate.mixin.js';
export default {
	mixins: [validate],
	props: {
		field: {
			type: Object,
			default(){
				return {};
			}
		},
		value: {
			type: [String, Number],
			default: ''
		}
	},
	data(){
		return {
			val: this.value
		};
	},
	watch: {
		val(v){
			this.$emit('input', v);
		}
	},
	mounted(){
		let type = this.field.type;
		if(type=='datetime' || type=='date') {
			Promise.all([
				loadCss('https://cdn.jsdelivr.net/npm/flatpickr@4.6.3/dist/flatpickr.min.css'),
				loadJs('https://cdn.jsdelivr.net/npm/flatpickr@4.6.3/dist/flatpickr.min.js')
			]).then(()=>{
				let options = {
					dateFormat: type=='datetime'?'Y-m-d H:i:S':'Y-m-d',
					wrap: false,
					defaultDate: new Date
				};
				if(type == 'datetime') {
					options = Object.assign(options,{
						enableTime: true,
						time_24hr: true,
						enableSeconds: true
					});
				}
				if(this.field.dateConfig) {
					if($type(this.field.dateConfig)=='object') {
						options = Object.assign(options, this.field.dateConfig);
					} else if($type(this.field.dateConfig)=='function'){
						options = Object.assign(options, this.field.dateConfig(this.field));
					}
				}
				window.flatpickr(this.$el, options);
			});
		}
		this.formatRule();
	},
	methods: {
		handleChange(field, evt) {
			field.change&&field.change(field, evt);
		}
	}
};
</script>