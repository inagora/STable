<template>
	<div v-show="spVisible" class="st-sp">
		<div class="st-sp-mask" @click="$emit('close')"></div>
		<div class="st-sp-doc">
			<div class="st-sp-head">
				<div class="st-sp-close">
					<i class="st-iconfont st-icon-arrowdown" @click="$emit('close')"></i>
				</div>
				<span class="st-sp-title" v-text="title"></span>
			</div>
			<div v-if="isPage" v-show="contentVisible" class="st-sp-body">
				<iframe class="st-sp-iframe" :src="html"></iframe>
			</div>
			<div
				v-else
				v-show="contentVisible"
				class="st-sp-body"
				v-html="html"
			></div>
		</div>
	</div>
</template>
<script>
export default {
	props:{
		visible: {
			type: Boolean
		}, 
		title:{
			type: String,
			default: ''
		}, 
		html: {
			type: String,
			default: ''
		}, 
		isPage: {
			type: Boolean
		}
	},
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
				this.$el.classList.add('st-sp-show');
			},0);
			setTimeout(()=>{
				this.contentVisible = true;
			},200);
		},
		hide(){
			this.$el.classList.remove('st-sp-show');
			setTimeout(()=>{
				this.contentVisible = false;
				this.spVisible = false;
			},200);
		}
	}
};
</script>
<style lang="scss">
.st-sp{
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	overflow: hidden;
	z-index: 99;

	&-mask{
		position: fixed;
		left: 0;
		right:0;
		top:0;
		bottom:0;
		background-color: #000;
		opacity: 0;
		transition: opacity 0.2s ease;
	}
	&-doc{
		position: fixed;
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
	&-show &-mask{
		opacity: 0.3;
	}
	&-show &-doc{
		right: 0;
	}
	&-head{
		padding: 5px 15px;
		border-bottom: 1px solid #ddd;
		border-top-left-radius: 3px;
		color:#333;
		background-color: #f5f5f5;

		display: flex;
		align-items: center;
	}
	&-title{
		margin-left: 10px;
		flex: 1;
		text-align: center;
	}
	&-close{
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 20px;
	}
	&-close>i{
		transform: rotate(-90deg);
	}
	&-close:hover>i{
		color: red;
		font-size: 1.2em;
	}

	&-body{
		position: absolute;
		top: 41px;
		right: 0;
		bottom:0;
		left: 1px;
		overflow: auto;
	}
	&-iframe{
		border: none;
		position:absolute;
		top:0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
}
</style>
