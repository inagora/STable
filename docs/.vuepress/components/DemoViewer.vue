<template>
	<div class="st-demo">
		<pre v-show="codeVisible">
			<code></code>
		</pre>
		<div class="st-demo-trigger">
			<div class="st-demo-name-box" @mouseenter="loadDemo" @click="codeVisible=!codeVisible">
				<div class="st-demo-name"><span class="st-demo-label">demo:</span> {{demo}}</div>
				<div class="st-demo-sign" :class="{'st-demo-sign-up': codeVisible}"></div>
				<div class="st-demo-desc" v-text="codeVisible?'隐藏代码':'显示代码'"></div>
			</div>
			<form v-if="prefillCode" action="https://codepen.io/pen/define" method="POST" target="_blank">
				<input type="hidden" name="data" :value='prefillCode'>

				<input class="st-demo-run" type="submit" value="在线运行">
			</form>
		</div>
	</div>
</template>

<script>
const STable_VERSION = 'v2.0.4';
export default {
	props: [ 'demo' ],
	data(){
		return {
			codeVisible: false,
			prefillCode: ''
		}
	},
	mounted(){
		if(!window.hljsInited){
			window.hljsInited = true;
			var s = document.createElement('script');
			s.src = '/STable/js/prism.js';
			document.head.appendChild(s);
		}
	},
	methods: {
		loadDemo(){
			if(this.codeLoaded) return;
			this.codeLoaded = true;
			fetch(`/STable/demo/${this.demo}.html`).then(res=>res.text()).then(code=>{
				let hlCode = Prism.highlight(code, Prism.languages.html, 'html');
				this.$el.querySelector('code').innerHTML = hlCode.trim();
				this.prefillCode = JSON.stringify({
					title: `${this.demo} - STable demo`,
					html: code.trim(),
					editors: '1000',
					head: 
						`<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/inagora/STable@${STable_VERSION}/dist/STable.min.css">`
						+'<script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js"><\/script>'
						+`<script src="https://cdn.jsdelivr.net/gh/inagora/STable@${STable_VERSION}/dist/STable.min.js"><\/script>`
				});
			})
		}
	}
}
</script>

<style>
.st-demo{
	border: 1px solid #ebebeb;
	border-radius: 6px;
	tab-size: 2;
}
.theme-default-content .st-demo  pre{
	margin: 0;
	border-radius: 6px 6px 0 0;
	text-indent: -40px;
}
.st-demo-trigger{
	display: flex;
	transition: background-color 0.2s ease, box-shadow 0.2s ease;
	cursor: pointer;
}
.st-demo-trigger:hover{
	background-color: #f9fafc;
	box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
}
.st-demo-name-box{
	flex: 1;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding-left: 10px;
	height: 30px;
}
.st-demo-name{
	width: 300px;
}
.st-demo-label{
	color: #3eaf7c;
	font-weight: 500;
}
.st-demo-sign{
	font-size: 0;
	line-height: 0;
	overflow: hidden;
	width: 0;
	height: 0;
	border:solid;
	border-width: 6px 5px 6px 5px;
	border-color: #3eaf7c transparent transparent transparent;
	transform: translate(0, 4px);
	transition: transform 0.2s ease, opacity 0.2s ease;
	opacity: 0.5;
}
.st-demo-trigger:hover .st-demo-sign{
	/* transform: translate(0, -6px) rotate(180deg); */
	opacity: 1;
}
.st-demo-sign.st-demo-sign-up{
	transform: translate(0, -4px) rotate(180deg);
}
.st-demo-desc{
	font-size: 12px;
	opacity: 0.5;
	transition: opacity 0.2s ease;
	margin-left: 3px;
}
.st-demo-trigger:hover .st-demo-desc{
	opacity: 1;
}
.st-demo-run{
	color: #3eaf7c;
	border: none;
	text-decoration: underline;
	font-weight: 500;
	cursor: pointer;
}
</style>
