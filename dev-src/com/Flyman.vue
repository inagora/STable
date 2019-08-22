<template>
	<div v-show="isLoading" class="st-load">
		<div class="st-load-man">
			<div class="st-load-body">
				<span class="st-load-heart"></span>
			</div>
			<div class="st-load-face"></div>
		</div>
		<div class="st-load-wind">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		visible: Boolean
	},
	data(){
		return {
			isLoading: this.visible
		};
	},
	watch: {
		visible(val) {
			if(val)
				this.isLoading = true;
			else {
				setTimeout(()=>{
					let el = this.$el.querySelector('.st-load-man');
					el.classList.add('st-load-man-out');
					setTimeout(()=>{
						this.isLoading = false;
						setTimeout(()=>{
							el.classList.remove('st-load-man-out');
						}, 0);
					}, 200);
				}, 0);
			}
		}
	}
};
</script>
<style lang="scss">
.st-load{
	position: absolute;
	width: 60%;
	height: 90%;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
	overflow: hidden;
	z-index: 3;
	background-image: radial-gradient(farthest-side, rgba(255,255,0,0.3) 20%, rgba(0,0,0,0) 80%);
	pointer-events:none;

	&-man {
		position: absolute;
		top: 50%;
		margin-left: -50px;
		left: 50%;
		transition: left 0.2s ease-in;
		animation: st_load_speeder .4s linear infinite;
		transform: rotate(-5deg);
	}

	&-man-out{
		left: 120%;
	}

	&-body {
		position: absolute;
		width: 0;
		height: 0;
		border-top: 6px solid transparent;
		border-right: 100px solid #000;
		border-bottom: 6px solid transparent;
	}
	&-body:before {
		content: "";
		height: 22px;
		width: 22px;
		border-radius: 50%;
		background: #000;
		position: absolute;
		right: -110px;
		top: -16px;
	}
	&-body:after {
		content: "";
		position: absolute;
		width: 0;
		height: 0;
		border-top: 0 solid transparent;
		border-right: 55px solid #000;
		border-bottom: 16px solid transparent;
		top: -16px;
		right: -98px;
	}
	&-heart{
		width: 5px;
		height: 7px;
		background-color: #fff;
		position: absolute;
		right: -107px;
		top: -5px;
		border-radius: 50%/50%;
		transform: rotate(65deg);
	}
	&-heart:after {
		content: '';
		width: 3px;
		height: 5px;
		background-color: #ccc;
		position: absolute;
		border-radius: 50%/50%;
		left: 1px;
		top: 1px;
	}

	&-face {
		position: absolute;
		height: 16px;
		width: 20px;
		background: #000;
		border-radius: 8px 8px 12px 12px;
		transform: rotate(-58deg);
		right: -125px;
		top: -16px;
	}
	&-face:before{
		content: ' ';
		background-color: #fff;
		width: 3px;
		height: 4px;
		font-size: 0;
		line-height: 0;
		position: absolute;
		top: 11px;
		left: 11px;
		border-radius: 3px 0 2px 0;
		transform: rotate(25deg);
	}
	&-face:after{
		content: '';
		position: absolute;
		border: 1px solid #666;
		border-width: 1px 0 0 1px;
		width: 9px;
		height: 4px;
		left: 4px;
		top: 9px;
		transform: skew(-40deg);
	}
	@keyframes st_load_speeder {
		0% {
			transform: translate(2px, 1px) rotate(0deg);
		}
		10% {
			transform: translate(-1px, -3px) rotate(-1deg);
		}
		20% {
			transform: translate(-2px, 0px) rotate(1deg);
		}
		30% {
			transform: translate(1px, 2px) rotate(0deg);
		}
		40% {
			transform: translate(1px, -1px) rotate(1deg);
		}
		50% {
			transform: translate(-1px, 3px) rotate(-1deg);
		}
		60% {
			transform: translate(-1px, 1px) rotate(0deg);
		}
		70% {
			transform: translate(3px, 1px) rotate(-1deg);
		}
		80% {
			transform: translate(-2px, -1px) rotate(1deg);
		}
		90% {
			transform: translate(2px, 1px) rotate(0deg);
		}
		100% {
			transform: translate(1px, -2px) rotate(-1deg);
		}
	}
	&-wind {
		position: absolute;
		width: 100%;
		height: 100%;
	}
	&-wind span {
		position: absolute;
		height: 2px;
		width: 20%;
		background: #000;
	}
	&-wind span:nth-child(1) {
		top: 20%;
		animation: st_load_wind .6s linear infinite;
		animation-delay: -5s;
	}
	&-wind span:nth-child(2) {
		top: 40%;
		animation: st_load_wind2 .8s linear infinite;
		animation-delay: -1s;
	}
	&-wind span:nth-child(3) {
		top: 60%;
		animation: st_load_wind3 .6s linear infinite;
	}
	&-wind span:nth-child(4) {
		top: 80%;
		animation: st_load_wind4 .5s linear infinite;
		animation-delay: -3s;
	}

	@keyframes st_load_wind {
		0% {
			left: 200%;
		}
		100% {
			left: -200%;
			opacity: 0;
		}
	}
	@keyframes st_load_wind2 {
		0% {
			left: 200%;
		}
		100% {
			left: -200%;
			opacity: 0;
		}
	}
	@keyframes st_load_wind3 {
		0% {
			left: 200%;
		}
		100% {
			left: -100%;
			opacity: 0;
		}
	}
	@keyframes st_load_wind4 {
		0% {
			left: 200%;
		}
		100% {
			left: -100%;
			opacity: 0;
		}
	}
}
</style>