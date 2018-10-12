<template>
	<div v-cloak v-show="isLoading" class="st-load">
		<div class="st-load-body">
			<span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</span>
			<div class="st-load-base">
				<span></span>
				<div class="st-load-face"></div>
			</div>
		</div>
		<div class="st-load-longfazers">
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	</div>
</template>
<script>
export default {
	props: ['visible'],
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
					let el = this.$el.querySelector('.st-load-body');
					el.classList.add('st-load-body-out');
					setTimeout(()=>{
						this.isLoading = false;
						setTimeout(()=>{
							el.classList.remove('st-load-body-out');
						}, 0);
					}, 200);
				}, 0);
			}
		}
	}
};
</script>
<style>
.st-load{
	position: fixed;
	width: 60%;
	height: 300px;
	left: 50%;
	top: 50%;
	transform: translate(-50%,-50%);
	overflow: hidden;
	pointer-events: none;
	background-image: radial-gradient(farthest-side, rgba(255,255,0,0.3) 20%, rgba(0,0,0,0) 80%);
	z-index: 3;
}
.st-load-body {
  position: absolute;
  top: 50%;
  margin-left: -50px;
  left: 50%;
  transition: left 0.2s ease-in;
  animation: st_load_speeder .4s linear infinite;
}

.st-load-body-out{
	left: 120%;
}
.st-load-body > span {
  height: 5px;
  width: 35px;
  background: #000;
  position: absolute;
  top: -19px;
  left: 60px;
  border-radius: 2px 10px 1px 0;
}

.st-load-base span {
  position: absolute;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-right: 100px solid #000;
  border-bottom: 6px solid transparent;
}
.st-load-base span:before {
  content: "";
  height: 22px;
  width: 22px;
  border-radius: 50%;
  background: #000;
  position: absolute;
  right: -110px;
  top: -16px;
}
.st-load-base span:after {
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

.st-load-face {
  position: absolute;
  height: 12px;
  width: 20px;
  background: #000;
  border-radius: 20px 20px 0 0;
  transform: rotate(-58deg);
  right: -125px;
  top: -16px;
}
.st-load-face:after {
  content: "";
  height: 14px;
  width: 14px;
  background: #000;
  right: 2px;
  top: 5px;
  position: absolute;
  transform: rotate(132deg);
  transform-origin: 50% 50%;
  border-radius: 0 0 0 2px;
}

.st-load-body > span > span:nth-child(1),
.st-load-body > span > span:nth-child(2),
.st-load-body > span > span:nth-child(3),
.st-load-body > span > span:nth-child(4) {
  width: 30px;
  height: 1px;
  background: #000;
  position: absolute;
  animation: st_load_fazer1 .2s linear infinite;
}

.st-load-body > span > span:nth-child(2) {
  top: 3px;
  animation: st_load_fazer2 .4s linear infinite;
}

.st-load-body > span > span:nth-child(3) {
  top: 1px;
  animation: st_load_fazer3 .4s linear infinite;
  animation-delay: -1s;
}

.st-load-body > span > span:nth-child(4) {
  top: 4px;
  animation: st_load_fazer4 1s linear infinite;
  animation-delay: -1s;
}

@keyframes st_load_fazer1 {
  0% {
    left: 0;
  }
  100% {
    left: -80px;
    opacity: 0;
  }
}
@keyframes st_load_fazer2 {
  0% {
    left: 0;
  }
  100% {
    left: -100px;
    opacity: 0;
  }
}
@keyframes st_load_fazer3 {
  0% {
    left: 0;
  }
  100% {
    left: -50px;
    opacity: 0;
  }
}
@keyframes st_load_fazer4 {
  0% {
    left: 0;
  }
  100% {
    left: -150px;
    opacity: 0;
  }
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
.st-load-longfazers {
  position: absolute;
  width: 100%;
  height: 100%;
}
.st-load-longfazers span {
  position: absolute;
  height: 2px;
  width: 20%;
  background: #000;
}
.st-load-longfazers span:nth-child(1) {
  top: 20%;
  animation: st_load_lf .6s linear infinite;
  animation-delay: -5s;
}
.st-load-longfazers span:nth-child(2) {
  top: 40%;
  animation: st_load_lf2 .8s linear infinite;
  animation-delay: -1s;
}
.st-load-longfazers span:nth-child(3) {
  top: 60%;
  animation: st_load_lf3 .6s linear infinite;
}
.st-load-longfazers span:nth-child(4) {
  top: 80%;
  animation: st_load_lf4 .5s linear infinite;
  animation-delay: -3s;
}

@keyframes st_load_lf {
  0% {
    left: 200%;
  }
  100% {
    left: -200%;
    opacity: 0;
  }
}
@keyframes st_load_lf2 {
  0% {
    left: 200%;
  }
  100% {
    left: -200%;
    opacity: 0;
  }
}
@keyframes st_load_lf3 {
  0% {
    left: 200%;
  }
  100% {
    left: -100%;
    opacity: 0;
  }
}
@keyframes st_load_lf4 {
  0% {
    left: 200%;
  }
  100% {
    left: -100%;
    opacity: 0;
  }
}
</style>