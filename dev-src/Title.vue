<template>
	<div v-if="titleVisible" class="st-title">
		<div class="st-title-text" v-text="title"></div>
	</div>
</template>

<script>
export default {
	inject: ['title', 'titleVisible']
}
</script>

<style>
	.st-title{
		color: #191919;
		height: 40px;
		background-color: #f8f8f8;
		border-bottom: 1px solid #d0d0d0;

		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.st-title-text{
		font-size: 16px;
		padding-left: 10px;
		font-weight: 500;
		flex: 1;
	}
</style>
