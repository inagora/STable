<template>
	<div v-show="visible" class="dialog">
		<div v-if="conf.modal" class="dialog-mask"></div>
		<div class="dialog-doc" :style="{width:conf.width, height:conf.height}">
			<div class="dialog-head">
				<div class="dialog-title" v-text="conf.title"></div>
				<div @click="close" class="dialog-close">❎</div>
			</div>
			<div class="dialog-body" :class="[conf.bodyCls]" :style="conf.bodyStyle">
				<slot></slot>
			</div>
			<div v-if="conf.buttons && conf.buttons.length>0" class="dialog-foot">
				<el-button
					v-for="(btn,idx) in conf.buttons"
					:key="idx"
					:icon="btn.icon"
					:type="btn.type"
					:form="btn.form"
					:native-type="btn.nativeType"
					@click="btnClick(btn, $event)"
					size="small">{{btn.text}}</el-button>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		inject: ['config'],
		data() {
			let conf = Object.assign({
				title: '',
				width: 640,
				height: 480,
				autoShow: true,
				closable: true,
				modal: true,
				closeAction: 'destroy',
				listeners: {},
				buttons: []
			}, this.config);

			let wType = typeof conf.width,
				hType = typeof conf.height;
			if(wType == 'string'){
				if(!conf.width.endsWith('%')) {
					conf.width = parseInt(conf.width, 10)+'px';
				}
			} else if(typeof conf.width == 'number')
				conf.width = conf.width+'px';

			if(hType == 'string'){
				if(!conf.height.endsWith('%')) {
					conf.width = parseInt(conf.height, 10)+'px';
				}
			} else if(typeof conf.height == 'number')
				conf.height = conf.height+'px';
			if(typeof conf.autoOpen != 'undefined')
				conf.autoShow = conf.autoOpen;

			if(conf.buttons) {
				conf.buttons.forEach(btn=>{
					if(btn.icon) {
						if(!btn.icon.startsWith('el-icon-')){
							btn.icon = 'el-icon-_fa fa fa-'+btn.icon;
						}
					}
				});
			}
			return {
				conf,
				visible: conf.autoShow||false
			}
		},
		mounted(){
			if(this.config.contentEl) {
				this.$el.querySelector('.st-dialog-body').appendChild(this.config.contentEl);
			}
			this.trigger('ready');
			
			let startX, startY;
			let doc = this.$el.querySelector('.dialog-doc');
			function drag(evt){
				doc.style.marginLeft = evt.clientX-startX+'px';
				doc.style.marginTop = evt.clientY-startY+'px';
			}
			function stopDrag() {
				doc.classList.remove('dialog-dragging');
				document.documentElement.removeEventListener('mousemove', drag, false);
				document.documentElement.removeEventListener('mouseup', stopDrag, false);
			}
			this.$el.querySelector('.dialog-head').addEventListener('mousedown', function(evt){
				evt.preventDefault();
				startX = evt.clientX-parseInt(doc.style.marginLeft||0, 10);
				startY = evt.clientY-parseInt(doc.style.marginTop||0, 10);
				document.documentElement.removeEventListener('mousemove', drag, false);
				document.documentElement.removeEventListener('mouseup', stopDrag, false);
				document.documentElement.addEventListener('mousemove', drag, false);
				document.documentElement.addEventListener('mouseup', stopDrag, false);
				doc.classList.add('dialog-dragging');
			},false);
		},
		methods: {
			trigger(evtName) {
				let args = Array.prototype.slice.call(arguments,1);
				if(this.conf.listeners[evtName]){
					this.conf.listeners[evtName].call(this.$root, args);
				}
			},
			show() {
				this.trigger('beforeshow');
				this.visible = true;
			},
			//为了兼容旧版本，留下open方法和open事件
			open() {
				this.trigger('beforeopen');
				this.visible = true;
			},

			hide() {
				this.trigger('beforehide');
				this.visible = false;
			},

			close() {
				this.trigger('beforehide');
				this.trigger('beforeclose');
				if(this.conf.closeAction=='destroy') {
					this.visible = false;
					this.$emit('destroy');
					this.$root.$destroy();
					this.$root.$el.remove();
					this.trigger('close');
					this.trigger('destroy');
				} else {
					this.visible = false;
					this.trigger('close');
				}
			},

			btnClick(btn, evt) {
				if(btn.click) {
					btn.click.call(this.$root, btn, evt);
				}
			}
		}
	}
</script>
<style scoped>
	.dialog-mask{
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(0,0,0,0.3);
		-webkit-backdrop-filter: blur(5px);
		backdrop-filter: blur(5px);
		z-index: 99;
	}
	.dialog-doc{
		z-index: 100;
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		background-color: rgba(255,255,255,0.9);
		border: 1px solid #d0d0d0;
		border-radius: 5px;
		overflow: hidden;

		color: #191919;

		display: flex;
		flex-direction: column;
	}
	.dialog-head{
		border-bottom: 1px solid #e8eaec;
		display: flex;
		align-items: center;
		height: 36px;
		font-size: 16px;
		cursor: move;
		-webkit-user-select: none;
		user-select: none;
	}
	.dialog-title{
		margin-left: 10px;
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.dialog-close{
		margin: 0 10px;
		cursor: pointer;
		opacity: 0.8;
	}
	.dialog-close:hover{
		opacity: 1;
	}
	.dialog-body{
		flex: 1;
		padding: 10px;
		overflow: auto;
		background-color: #fff;
	}
	.dialog-foot{
		border-top: 1px solid #e8eaec;
		background-color: #fafafa;
		padding: 7px 20px 8px;
		text-align: right;
	}
	.dialog-foot>button{
		margin-left: 20px;
	}

	.dialog-dragging .dialog-body,
	.dialog-dragging .dialog-foot{
		display: none;
	}
</style>