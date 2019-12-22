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
	}
};
</script>

<style>

</style>
