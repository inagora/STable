<template>
	<div v-show="visible" class="st-dialog">
		<div v-if="modal" class="st-dialog-mask"></div>
		<div
			class="st-dialog-doc"
			:style="{
				width,
				height,
				left,
				top
			}"
		>
			<div class="st-dialog-head">
				<div
					:class="{
						'st-dialog-draggable': draggable
					}"
					class="st-dialog-title"
					@mousedown="prepareDrag"
					v-text="title"
				></div>
				<div
					v-if="closable"
					class="st-dialog-close st-iconfont st-icon-close"
					@click="$emit('close')"
				></div>
			</div>
			<div
				:class="[bodyCls]"
				:style="bodyStyle"
				class="st-dialog-body"
			>
				<slot></slot>
			</div>
			<div
				v-if="buttons && buttons.length>0"
				class="st-dialog-foot"
			>
				<x-button
					v-for="(btn, btnIdx) of buttons"
					:key="btnIdx"
					v-bind="btn"
					@click="btnClick(btnIdx)"
				>
					{{ btn.text }}
				</x-button>
			</div>
			<div
				v-if="resizable"
				@mousedown="prepareResize"
			>
				<div class="st-dialog-rz st-dialog-n"></div>
				<div class="st-dialog-rz st-dialog-e"></div>
				<div class="st-dialog-rz st-dialog-s"></div>
				<div class="st-dialog-rz st-dialog-w"></div>
				<div class="st-dialog-rz st-dialog-nw"></div>
				<div class="st-dialog-rz st-dialog-ne"></div>
				<div class="st-dialog-rz st-dialog-se"></div>
				<div class="st-dialog-rz st-dialog-sw"></div>
			</div>
		</div>
		<div v-show="proxyVisible" class="st-dialog-proxy"></div>
	</div>
</template>

<script>
import XButton from './Button.vue';

let docEl = document.documentElement;
export default {
	inject: ['dialogConfig'],
	components: {XButton},
	data(){
		let conf = Object.assign({
			title: '',
			width: 640,
			height: 480,
			left: 0,
			top: 0,
			autoShow: true,
			closable: true,
			modal: true,
			closeAction: 'destroy',
			bodyCls: '',
			bodyStyle: {},
			listeners: {},
			buttons: [],
			resizable: true,
			draggable: true,
			proxyVisible: false
		}, this.dialogConfig);
		
		let wType = typeof conf.width,
			hType = typeof conf.height;
		if(wType == 'string' && conf.width.endsWith('%')) {
			conf.width = Math.ceil(docEl.clientWidth*parseFloat(conf.width)/100)+'px';
		} else {
			conf.width += 'px';
		}
		if(hType=='string' && conf.height.endsWith('%')) {
			conf.height = Math.ceil(docEl.clientHeight*parseFloat(conf.height)/100)+'px';
		} else {
			conf.height += 'px';
		}
		if(typeof conf.autoOpen != 'undefined')
			conf.autoShow = conf.autoOpen;
		conf.visible = conf.autoShow;
		return conf;
	},
	mounted(){
		if(this.dialogConfig.contentEl) {
			this.$el.querySelector('.st-dialog-body').appendChild(this.dialogConfig.contentEl);
		}
		this.$nextTick(()=>{
			let doc = this.$el.querySelector('.st-dialog-doc');
			let rect = doc.getBoundingClientRect();
			this.left = Math.ceil((docEl.clientWidth - rect.width)/2) + 'px';
			this.top = Math.ceil((docEl.clientHeight - rect.height)/2) + 'px';
		});
	},
	methods: {
		btnClick(idx){
			if(this.buttons[idx].click)
				this.buttons[idx].click.call(this.$root);
		},
		prepareDrag(evt){
			if(!this.draggable)
				return;
			evt.preventDefault();
			this.clearDrag();
			
			this.canDrag = true;
			this.dragHandle = this.drag.bind(this);
			this.stopDragHandle = this.stopDrag.bind(this);
			this.dragPos = {
				startX: evt.clientX,
				startY: evt.clientY,
				rect: this.$el.querySelector('.st-dialog-doc').getBoundingClientRect()
			};
			docEl.addEventListener('mousemove', this.dragHandle, false);
			docEl.addEventListener('mouseup', this.stopDragHandle, false);
		},
		drag(evt){
			if(!this.canDrag)
				return;
			evt.preventDefault();
			let rect = this.dragPos.rect;
			if(!this.proxy) {
				this.proxy = this.$el.querySelector('.st-dialog-proxy');
				this.proxyVisible = true;
				this.proxy.style.cssText= `top: ${rect.top}px;left:${rect.left}px;width:${rect.width}px;height:${rect.height}px`;
			}

			this.proxy.style.left = rect.left+(evt.clientX-this.dragPos.startX)+'px';
			this.proxy.style.top = rect.top+(evt.clientY-this.dragPos.startY)+'px';
		},
		clearDrag(){
			this.canDrag = false;
			if(this.dragHandle) {
				docEl.removeEventListener('mousemove', this.dragHandle, false);
				docEl.removeEventListener('mouseup', this.stopDragHandle, false);
				this.dragHandle = null;
				this.stopDragHandle = null;
				this.proxy = null;
				this.proxyVisible = false;
			}
		},
		stopDrag(evt){
			this.clearDrag();
			this.left = evt.clientX - this.dragPos.startX + this.dragPos.rect.left + 'px';
			this.top = evt.clientY - this.dragPos.startY + this.dragPos.rect.top + 'px';
		},
		prepareResize(evt){
			if(!this.resizable)
				return;
			let type = '';
			let posCls = {
				n: 'st-dialog-n',
				e: 'st-dialog-e',
				s: 'st-dialog-s',
				w: 'st-dialog-w',
				nw: 'st-dialog-nw',
				ne: 'st-dialog-ne',
				se: 'st-dialog-se',
				sw: 'st-dialog-sw'
			};
			for(let t of ['n','e','s','w', 'nw', 'ne', 'se', 'sw']){
				if(evt.target.classList.contains(posCls[t])){
					type = t;
					break;
				}
			}
			if(!type)
				return;
			evt.preventDefault();
			this.clearResize();
			
			this.canResize = true;
			this.resizeHandle = this.resize.bind(this);
			this.stopResizeHandle = this.stopResize.bind(this);
			
			this.resizePos = {
				type,
				startX: evt.clientX,
				startY: evt.clientY,
				rect: this.$el.querySelector('.st-dialog-doc').getBoundingClientRect()
			};
			docEl.addEventListener('mousemove', this.resizeHandle, false);
			docEl.addEventListener('mouseup', this.stopResizeHandle, false);
		},
		resize(evt){
			if(!this.canResize)
				return;
			evt.preventDefault();
			let {rect, startX, startY} = this.resizePos;
			if(!this.proxy) {
				this.proxy = this.$el.querySelector('.st-dialog-proxy');
				this.proxyVisible = true;
				this.proxy.style.cssText= `top: ${rect.top}px;left:${rect.left}px;width:${rect.width}px;height:${rect.height}px`;
			}
			let left,top,width,height;
			const MIN_SIZE = 50;
			switch(this.resizePos.type) {
			case 'nw': 
				left = evt.clientX - startX + rect.left;
				top = evt.clientY - startY + rect.top;
				width = rect.width - (evt.clientX - startX);
				height = rect.height - (evt.clientY - startY);
				if(width < MIN_SIZE) {
					width = MIN_SIZE;
					left = rect.left+rect.width-MIN_SIZE;
				}
				if(height < MIN_SIZE) {
					height = MIN_SIZE;
					top = rect.top+rect.height-MIN_SIZE;
				}
				break;
			
			case 'ne': {
				left = rect.left;
				top = evt.clientY - startY + rect.top;
				width = evt.clientX - startX + rect.width;
				height = rect.height - (evt.clientY - startY);
				if(width < MIN_SIZE) {
					width = MIN_SIZE;
				}
				if(height < MIN_SIZE) {
					height = MIN_SIZE;
					top = rect.top+rect.height-MIN_SIZE;
				}
				break;
			}
			case 'se': {
				left = rect.left;
				top = rect.top;
				width = evt.clientX - startX + rect.width;
				height = evt.clientY - startY + rect.height;
				if(width < MIN_SIZE) {
					width = MIN_SIZE;
				}
				if(height < MIN_SIZE) {
					height = MIN_SIZE;
				}
				break;
			}
			case 'sw': {
				left = evt.clientX - startX + rect.left;
				top = rect.top;
				width = rect.width - (evt.clientX - startX);
				height = evt.clientY - startY + rect.height;
				if(width < MIN_SIZE){
					width = MIN_SIZE;
					left = rect.left+rect.width-MIN_SIZE;
				}
				if(height < MIN_SIZE) {
					height = MIN_SIZE;
				}
				break;
			}
			case 'n': {
				left = rect.left;
				top = evt.clientY - startY + rect.top;
				width = rect.width;
				height = rect.height - (evt.clientY - startY);
				if(height < MIN_SIZE) {
					height = MIN_SIZE;
					top = rect.top + rect.height - MIN_SIZE;
				}
				break;
			}
			case 'e': {
				left = rect.left;
				top = rect.top;
				width = evt.clientX - startX + rect.width;
				height = rect.height;
				if(width < MIN_SIZE) {
					width = MIN_SIZE;
				}
				break;
			}
			case 's': {
				left = rect.left;
				top = rect.top;
				width = rect.width;
				height = evt.clientY - startY + rect.height;
				if(height< MIN_SIZE){
					height = MIN_SIZE;
				}
				break;
			}
			case 'w': {
				left = evt.clientX - startX + rect.left;
				top = rect.top;
				width = rect.width - (evt.clientX - startX);
				height = rect.height;
				if(width < MIN_SIZE){
					width = MIN_SIZE;
					left = rect.left + rect.width - MIN_SIZE;
				}
				break;
			}
			}

			this.proxy.style.cssText= `top: ${top}px;left:${left}px;width:${width}px;height:${height}px`;
		},
		clearResize(){
			this.canResize = false;
			if(this.resizeHandle) {
				docEl.removeEventListener('mousemove', this.resizeHandle, false);
				docEl.removeEventListener('mouseup', this.stopResizeHandle, false);
				this.resizeHandle = null;
				this.stopResizeHandle = null;
				this.proxy = null;
				this.proxyVisible = false;
			}
		},
		stopResize(){
			if(this.proxy){
				let rect = this.proxy.getBoundingClientRect();
				this.left = rect.left+'px';
				this.top = rect.top+'px';
				this.width = rect.width+'px';
				this.height = rect.height+'px';
			}
			this.clearResize();
		}
	}
};
</script>

<style lang="scss">
.st-dialog{
	&-mask{
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(0,0,0,0.3);
		z-index: 100;
	}
	&-doc{
		z-index: 100;
		position: fixed;
		border: 1px solid #d0d0d0;
		border-radius: 5px;
		overflow: hidden;

		color: #191919;
		display: flex;
		flex-direction: column;
	}
	&-head{
		border-bottom: 1px solid #e8eaec;
		background: #fafafa;
		display: flex;
		align-items: center;
		height: 36px;
		font-size: 16px;
		-webkit-user-select: none;
		user-select: none;
	}
	&-title{
		margin-left: 10px;
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		align-self: stretch;
		line-height: 36px;
		font-size: 12px;
		opacity: 0.8;
	}
	&-draggable{
		cursor: move;
	}
	&-close{
		margin: 0 10px;
		cursor: pointer;
		opacity: 0.9;
	}
	&-close:hover{
		opacity: 1;
		background-color: red;
		color: #fff;
	}
	&-body{
		flex: 1;
		padding: 10px;
		overflow: auto;
		background-color: #fff;
	}
	&-foot{
		border-top: 1px solid #e8eaec;
		background-color: #fafafa;
		padding: 7px 20px 8px;
		text-align: right;
	}
	&-foot>button{
		margin-left: 10px;
	}
	&-proxy{
		border: 1px dashed #666;
		position: fixed;
		box-sizing: border-box;
		z-index: 100;
	}
	$resize-width: 3px;
	&-rz{
		position: absolute;
		-webkit-user-select: none;
		user-select: none;
	}
	&-n{
		left: 0;
		top: 0;
		width: 100%;
		height: $resize-width;
		cursor: row-resize;
	}
	&-s{
		left: 0;
		bottom: 0;
		width: 100%;
		height: $resize-width;
		cursor: row-resize;
	}
	&-e{
		right: 0;
		top: 0;
		width: $resize-width;
		height: 100%;
		cursor: col-resize;
	}
	&-w{
		left: 0;
		top: 0;
		width: $resize-width;
		height: 100%;
		cursor: col-resize;
	}
	&-nw{
		left: 0;
		top: 0;
		width: $resize-width;
		height: $resize-width;
		cursor: nwse-resize;
	}
	&-ne{
		right: 0;
		top: 0;
		width: $resize-width;
		height: $resize-width;
		cursor: nesw-resize;
	}
	&-se{
		right: 0;
		bottom: 0;
		width: $resize-width;
		height: $resize-width;
		cursor: nwse-resize;
	}
	&-sw{
		left: 0;
		bottom: 0;
		width: $resize-width;
		height: $resize-width;
		cursor: nesw-resize;
	}
}
</style>
