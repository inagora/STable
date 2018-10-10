<template>
	<div class="x-pb-box" v-show="visible">
		<div class="x-pb">
			<div class="x-pb-text" v-text="text"></div>
			<div class="x-pb-in" :style="{width:val*100+'%'}">
				<div class="x-pb-in-text-box">
					<div class="x-pb-in-text" v-text="text"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: ['visible', 'val', 'text']
}
</script>
<style scoped>
	.x-pb-box{
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(0,0,0,0.6);
		-webkit-backdrop-filter: blur(3px);
		backdrop-filter: blur(3px);
		z-index: 99;
	}
	.x-pb{
		height: 50px;
		background: #fff;
		border: 1px solid #e9ecef;
		border-radius: 4px;
		width: 62%;
		max-width: 1200px;
		position: absolute;
		left: 0;
		top: 0;
		transform: translate(-50%, -50%);
	}
</style>