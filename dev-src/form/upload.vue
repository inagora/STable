<template>
	<div class="st-upload-wrap">
		<div>
			<input 
				ref="choosefile" 
				type="file"
				hidden
				multiple
				@change="chooseUploadFile"
			/>
			<div v-for="(item, index) in uploadFiles" :key="index" class="st-upload-file">
				<div class="st-upload-file-name st-icon-file">
					{{ item.name }}
				</div>
				<div class="st-upload-file-icon st-icon-close" @click.prevent="delUploadFiles(index)"></div>
			</div>
			<x-button class="st-form-btn-item" type="primary" @click.prevent="click">
				上传
			</x-button>
		</div>
	</div>
</template>

<script>
import XButton from "../com/Button.vue";
import qtip from '../com/qtip';

export default {
	name: 'XUpload',
	components: {XButton},
	props: {
		type: {
			type: String,
			default: 'file'
		},
		action: {
			type: String,
			default: '',
			required: true
		},
		name: {
			type: String,
			default: 'file'
		},
	},
	inject:['ajax'],
	data(){
		return {
			uploadFiles: [],
			params: {},
		};
	},
	methods: {
		click() {
			this.$refs.choosefile.click();
		},
		chooseUploadFile() {
			this.uploadFiles = [];
			let files = this.$refs.choosefile.files;
			if (!files.length) {
				this.uploadFiles = [];
			} else {
				for (const item of files) {
					this.uploadFiles.push(item);
				}
			}
			this.ajaxUploadFiles(this.uploadFiles);
		},
		delUploadFiles(index) {
			if (index > -1) {
				let value = this.uploadFiles;
				value.splice(index, 1);
				this.uploadFiles = value;
				this.ajaxUploadFiles(this.uploadFiles);
			}
		},
		ajaxUploadFiles(files) {
			let params = new FormData();
			params.append(this.name, files);
			return this.ajax.request({url: this.action, params, method: 'POST'}).then(res=>{
				if(res.errno==0 || res.code==0) {
					this.$refs.choosefile.value = null;
				} else {
					qtip.error(res.msg);
				}
			});
		}
	},
};
</script>


<style lang='scss' scoped>
.st-upload-wrap {
  width: 100%;
  display: flex;
}
.st-upload-file {
	display: flex;
	font-family: 'st-iconfont';
	justify-content: space-between;

  &-name {
		font-size: 12px;
		margin-left: 30px;
	}
	&-icon {
		width: 40px;
		height: 40px;
	}
}
</style>

