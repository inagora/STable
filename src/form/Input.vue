<template>
	<input
		v-model="value"
		:type="field.nativeType||'text'"
		:name="field.name"
		class="st-form-input"
		@focus="$emit('fieldfocus')"
		@blur="$emit('fieldblur')"
	/>
</template>

<script>
import { loadJs, loadCss } from '../util/util';
export default {
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
			]).then(()=>{});
		}
	}
};
</script>

<style>

</style>
