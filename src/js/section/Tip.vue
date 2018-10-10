<template>
	<div v-if="tip" v-html="tip" class="st-tip"></div>
</template>
<script>
export default {
	inject: {
		tip: {
			default: ''
		}
	}
}
</script>
<style>
.st-tip{
	border-bottom: 1px solid #d0d0d0;
	padding: 6px 8px;
	font-size: 14px;
}
</style>