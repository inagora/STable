<template>
	<div class="x-pb-box" v-show="visible">
		<div class="x-pb">
			<div class="x-pb-text" v-text="text"></div>
			<div class="x-pb-in" :style="[pbWidth]" :class="{'x-pb-infinite': type=='infinite'}">
				<div class="x-pb-in-text" v-text="text"></div>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: ['visible', 'val', 'text', 'type'],
	data(){
		return {
			pbWidth: {
				width: 0
			}
		}
	},
	watch: {
		visible(val) {
			if(val) {
				setTimeout(()=>{
					this.$el.querySelector('.x-pb-in-text').style.width = 
						this.$el.querySelector('.x-pb').getBoundingClientRect().width+'px';
				}, 50);
			}
		},
		val(v) {
			if(this.type != 'infinite') {
				this.pbWidth = {width: v*100+'%'};
			}
		}
	}
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
		background: #e9ecef;
		border-radius: 4px;
		width: 62%;
		max-width: 1200px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		overflow: hidden;


		line-height: 50px;
		text-align: center;
		color: #000;
		font-size: 14px;
	}

	@keyframes x_pb_in_amin {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: -50px 0;
		}
	}
	.x-pb-in{
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		background-color: #007bff;
		background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
		background-size: 50px 50px;
		border-radius: 4px 0 0 4px;
		transition: width 0.2s ease;
		animation: x_pb_in_amin 1s linear infinite;
		overflow: hidden;
	}
	.x-pb-in-text{
		color: #fff;
	}

	@keyframes x_pb_in_width_amin {
		0% {
			width: 0;
		}
		100% {
			width: 100%;
		}
	}
	.x-pb-infinite{
		transition: none;
		animation: x_pb_in_amin 1s linear infinite, x_pb_in_width_amin 10s ease-in-out infinite;
	}
</style>