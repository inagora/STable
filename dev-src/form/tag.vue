<script>
export default {
	name: 'XTag',
	props: {
		text: String,
		closable: Boolean,
		type: String,
		color: String,
		size: String
	},
	computed: {
		tagSize() {
			return this.size || 'normal';
		}
	},
	methods: {
		handleClose(event) {
			event.stopPropagation();
			this.$emit('close', event);
		},
	},
	render() {
		const { type, tagSize } = this;
		const classes = [
			'st-tag',
			type ? `st-tag_${type}` : '',
			tagSize ? `st-tag_${tagSize}` : '',
		];
		return (
			<span
				class={ classes }
				style={{ backgroundColor: this.color }}>
				{ this.$slots.default }
				{
					this.closable && <i class="st-iconfont st-icon-close st-tag-close" on-click={ this.handleClose }></i>
				}
			</span>
		);
	}
};
</script>

<style lang="scss" scoped>
.st-tag {
  background-color: #ecf5ff;
  display: inline-block;
  height: 32px;
  padding: 0 10px;
  line-height: 30px;
  font-size: 12px;
  color: #409eff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  margin-left: 10px;

  &_info {
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
  }
  &_success {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67c23a;
  }
  &_warning {
    background-color: #fdf6ec;
    border-color: #faecd8;
    color: #e6a23c;
  }
  &_danger {
    background-color: #fef0f0;
    border-color: #fde2e2;
    color: #f56c6c;
  }  
  &-close{
    font-size: 12px;
    margin-left: 5px;
  }

  &_normal {

  }
  &_small{
    height: 20px;
    padding: 0 5px;
    line-height: 19px;
  }
}
</style>
