<template>
	<div v-if="tip" class="st-tip" v-html="tip"></div>
</template>

<script>
export default {
	inject: ['tip']
};
</script>

<style>
.st-tip{
	border-bottom: 1px solid #d0d0d0;
	padding: 10px;
}
</style>
