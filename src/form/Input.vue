<template>
	<input
		v-model="value"
		:type="field.nativeType||'text'"
		:name="field.name"
		:placeholder="field.placeholder"
		class="st-form-input"
		data-input
		@focus="$emit('fieldfocus')"
		@blur="$emit('fieldblur');validate()"
		@input="validate(true)"
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
		}
	},
	data(){
		return {
			value: this.field.value||''
		};
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
					wrap: true,
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
				window.flatpickr(this.$el.closest('.st-form-input-box'), options);
			});
		}
		this.formatRule();
	}
};
</script>

<style>

</style>
