<template>
	<div class="st-form-field">
		<label v-show="labelVisible" class="st-form-field" v-text="label"></label>
		<div class="st-form-input-box" @fieldfocus="f">
			<slot></slot>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		labelVisible: Boolean,
		label: {
			type: String,
			default: ''
		}
	},
	methods: {
		f(){
			console.log('f');
		}
	}
};
</script>

<style>

</style>
