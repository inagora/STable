<template>
	<div class="st-up-box">
		<div
			v-for="(info, idx) in files"
			:key="idx"
			class="st-up-item"
		>
			<div class="st-up-item-img">
				<img :src="isImage ? info.imgUrl : 'https://s.wandougongzhu.cn/s/a6/file_f79c4a.png'" />
			</div>
			<div class="st-up-file-name" v-text="info.name"></div>
			<span class="fa fa-remove st-up-del-btn" @click="remove(idx)"></span>
			<div v-if="info.status=='progress'" class="st-up-progress">
				<div class="st-up-progress-bg" :style="{width:info.percent+'%'}"></div>
				<div class="st-up-progress-txt" v-text="locale.uploadProgress+'：'+info.percent+'%'"></div>
			</div>
			<div v-else-if="info.status=='load'" class="st-up-progress st-up-progress-loaded">
				<span class="fa fa-check"></span> {{ locale.uploadDone }}
			</div>
			<div v-else-if="info.status=='error'" class="st-up-progress st-up-progress-error">
				<span class="fa fa-remove"></span> {{ locale.uploadFail }}
			</div>
		</div>
		<label v-if="files.length<=0 || fieldConf.uploadConfig.multiple" class="st-up-item">
			<span class="fa fa-upload st-up-icon"></span>
			<input
				class="st-up-input"
				:accept="isImage?'image/*':'*/*'"
				type="file"
				@change="upload"
			/>
		</label>
	</div>
</template>
<script>
export default {
	props: {
		value: {
			type: String,
			default: ''
		},
		field: {
			type: Object,
			default(){
				return {};
			}
		}
	},
	data(){
		let uploadConfig = this.field.uploadConfig||{};
		let isImage = uploadConfig.isImage||false;
		let val = [];
		if(!this.value)
			val = [];
		else if(Array.isArray(this.val))
			val = this.val.slice(0);
		else
			val = [this.val];
		
		let files = val.map(url=>{
			let info;
			if(uploadConfig.getFileInfo)
				info = uploadConfig.getFileInfo(url);
			else if (typeof url == 'string') {
				if(/^inagora-public:(.+)/.test(url)) {
					info = {
						imgUrl: 'https://ossimg.wandougongzhu.cn/'+RegExp.$1+'@120w_120h_1l_30Q_1wh_1pr.jpg',
						name: url,
						value: url
					};
				}else{
					let name = url.split('/').pop();
					info = {
						imgUrl: isImage?url: '',
						name,
						value: url
					};
				}
			} else {
				info = url;
			}
			return Object.assign({status:'ok'}, info);
		});
		return {
			files,
			isImage
		};
	},
	methods: {
		upload(evt){
			if(!evt || !evt.target.files || evt.target.files.length<=0)
				return;
			let upConf = this.fieldConf.uploadConfig;
			let file = evt.target.files[0],
				formData = new FormData();
			formData.append('file', file);
			if(window._token){
				formData.append('_token', window._token);
			}
			if(upConf.formData){
				let fd;
				if(typeof upConf.formData=='function')
					fd = upConf.formData(file);
				else
					fd = upConf.formData;
				for(let name in fd){
					formData.append(name, fd[name]);
				}
			}

			let isImage = this.isImage && /image/i.test(file.type);
			let imgUrl='';
			if(isImage){
				try{
					imgUrl = window.URL.createObjectURL(file);
				}catch(e){
					console.log(e);
				}
			}
			var upInfo = {
				status: 'progress',
				percent: 0,
				imgUrl: imgUrl,
				name: file.name,
				value: ''
			};
			this.files.push(upInfo);

			let xhr = new XMLHttpRequest();
			xhr.upload.addEventListener("progress", function(_evt){
				let per = Math.floor(_evt.loaded * 100 / _evt.total);
				per = per<0 ? 0 : (per>100?100: per);
				upInfo.percent = per;
			}, false);
			xhr.addEventListener("load", e=>{
				upInfo.status = 'load';
				let res = JSON.parse(e.target.responseText);
				if(res.errno){
					alert(res.errmsg);
				} else {
					let url;
					if(upConf.formatResult){
						url = upConf.formatResult(res, this.fieldConf);
					} else {
						url = res.data.url;
					}
					
					upInfo.value = url;
					this.syncFileVal();
				}
			}, false);
			xhr.addEventListener("error", function(){
				upInfo.status = 'error';
			}, false);
			xhr.addEventListener("abort", function(){}, false);
			xhr.open('POST', upConf.url);
			if(window._csrf_key){
				xhr.setRequestHeader(window._csrf_key, window._csrf_token||'');
			}
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.send(formData);
			upInfo.xhr = xhr;
			evt.target.value='';

			setTimeout(()=>{
				upInfo.xhr = xhr;
			}, 0);
		},
		remove(idx){
			if(this.files[idx]){
				let info = this.files.splice(idx, 1);
				if(info.length>0 && info[0].xhr)
					info[0].xhr.abort();
				this.syncFileVal();
			}
		},
		syncFileVal() {
			let isLoading = false;
			let vals = this.files.map(info=>{
				if(info.status=='progress')
					isLoading = true;
				if(info.status=='ok'||info.status=='load')
					return info.value;
				else
					return '';
			});
			if(this.fieldConf.uploadConfig.multiple) {
				this.$emit('update:val', vals)
			} else {
				this.$emit('update:val', vals.length>0? vals[0] : '')
			}
			this.$emit('update:loading', isLoading);
		}
	}
};
</script>
<style lang="scss">
.st-up{
	&-box{
		display: flex;
		flex-wrap: wrap;
	}
	&-item{
		width: 100px;
		height: 120px;
		border: 1px solid #ccc;
		position: relative;
		margin-right: 10px;
		overflow: hidden;
	}
	&-item:hover{
		border-color: #999;
	}
	&-item-img{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100px;
		height: 100px;
	}
	&-item img{
		max-height: 90px;
		max-width: 90px;
	}
	&-file-name{
		border-top: 1px solid #ccc;
		width: 100px;
		height: 20px;
		line-height: 20px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: center;
		font-size: 12px;
	}
	&-del-btn{
		position: absolute;
		right: 0;
		top: 0;
		width: 20px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		color: red;
		font-size: 14px;
		cursor: pointer;
		opacity: 0.8;
	}
	&-del-btn:hover{
		font-size: 16px;
		opacity: 1;
	}
	&-progress{
		position: absolute;
		width: 100px;
		height: 20px;
		left: 0;
		bottom: 18px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
		line-height: 20px;
		background-color: rgba(0,0,0,0.6);
	}
	&-progress-bg{
		position: absolute;
		left: 0;
		top:0;
		height: 20px;
		width: 0;
		z-index: 1;
		background: #409eff;
	}
	&-progress-txt{
		line-height: 20px;
		font-size: 12px;
		text-align: center;
		position: relative;
		z-index: 2;
		color: #fff;
	}
	&-progress-loaded{
		background: #409eff;
		color: #fff;
	}
	&-progress-error{
		color: red;
	}
	&-icon{
		font-size: 60px;
		color: #ccc;
		line-height: 120px;
		margin-left: 20px;
	}
	&-icon:hover{
		color: #666;
	}
	&-input{
		position: absolute;
		left: 0;
		top: 0;
		clip: rect(1px,1px,1px,1px);
		opacity: 0;
	}
}
</style>