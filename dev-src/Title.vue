<template>
	<div v-if="titleVisible" class="st-title">
		<div class="st-title-text" v-text="title"></div>
	</div>
</template>

<script>
export default {
	inject: ['title', 'titleVisible']
};
</script>

<style>
	.st-title{
		color: #191919;
		background-color: #f8f8f8;
		border-bottom: 1px solid #d0d0d0;
		padding: 7px 10px 5px;
	}
	.st-title-text{
		font-size: 14px;
		font-weight: 500;
	}
</style>
