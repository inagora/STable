<template>
	<div class="x-sp" v-show="spVisible">
		<div class="x-sp-mask" @click="$emit('close')"></div>
		<div class="x-sp-doc">
			<div class="x-sp-head">
				<el-button icon="el-icon-back x-sp-close-btn" circle size="mini" type="danger" plain @click="$emit('close')"></el-button>
				<span class="x-sp-title" v-text="title"></span>
				
			</div>
			<div v-if="isPage" v-show="contentVisible" class="x-sp-body">
				<iframe class="x-sp-iframe" :src="html"></iframe>
			</div>
			<div v-else v-show="contentVisible" class="x-sp-body" v-html="html"></div>
		</div>
	</div>
</template>
<script>
export default {
	props:['visible', 'title', 'html', 'isPage'],
	data(){
		return {
			spVisible: false,
			contentVisible: false
		};
	},
	watch: {
		visible(val){
			val ? this.show() : this.hide();
		}
	},
	methods: {
		show(){
			this.spVisible = true;
			setTimeout(()=>{
				this.$el.classList.add('x-sp-show');
			},0);
			setTimeout(()=>{
				this.contentVisible = true;
			},200);
		},
		hide(){
			this.$el.classList.remove('x-sp-show');
			setTimeout(()=>{
				this.contentVisible = false;
				this.spVisible = false;
			},200);
		}
	}
}
</script>
<style scoped>
.x-sp{
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	overflow: hidden;
	z-index: 99;
}
.x-sp-mask{
	position: absolute;
	left: 0;
	right:0;
	top:0;
	bottom:0;
	background-color: #000;
	-webkit-backdrop-filter: blur(5px);
	backdrop-filter: blur(5px);
	opacity: 0;
	transition: opacity 0.2s ease;
}
.x-sp-doc{
	position: absolute;
	background-color: #fff;
	width: 90%;
	max-width: 2000px;
	top: 10px;
	right: -2000px;
	bottom: 10px;

	transition: right 0.2s ease;

	border-radius: 4px 0 0 4px;
	border: 1px solid #ddd;
	border-right-width: 0;
	-webkit-box-shadow: 0 1px 1px rgba(0,0,0,.05);
	        box-shadow: 0 1px 1px rgba(0,0,0,.05);
}
.x-sp-show .x-sp-mask{
	opacity: 0.3;
}
.x-sp-show .x-sp-doc{
	right: 0;
}
.x-sp-head{
	padding: 5px 15px;
	border-bottom: 1px solid #ddd;
	border-top-left-radius: 3px;
	color:#333;
	background-color: #f5f5f5;

	display: flex;
	align-items: center;
}
.x-sp-title{
	margin-left: 10px;
	flex: 1;
	text-align: center;
}
.x-sp-head .el-button{
	transform: rotateY(180deg);
}

.x-sp-body{
	position: absolute;
	top: 41px;
	right: 0;
	bottom:0;
	left: 1px;
	overflow: auto;
}
.x-sp-iframe{
	border: none;
	position:absolute;
	top:0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

</style>
