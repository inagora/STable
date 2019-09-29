<script>
export default {
	name: 'XTag',
	props: {
		text: {
			type: String,
			default: ''
		},
		closable: {
			type: Boolean,
			default: false
		},
		type: {
			type: String,
			default: ''
		},
		color: {
			type: String,
			default: '#fff'
		},
		size: {
			type: String,
			default: 'small'
		}
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
		let typeCls = {
			info: 'st-tag-info',
			success: 'st-tag-success',
			warning: 'st-tag-warning',
			danger: 'st-tag-danger'
		};
		let sizeCls = {
			normal: 'st-tag-normal',
			small: 'st-tag-small'
		};
		const classes = [
			'st-tag',
			type ? typeCls[type] : '',
			tagSize ? sizeCls[tagSize] : '',
		];
		return (
			<span
				class={ classes }
				style={{ backgroundColor: this.color }}>
				{ this.$slots.default }
				{
					this.closable && <i class="st-icon st-icon-close st-tag-close" on-click={ this.handleClose }></i>
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

  &-info {
    background-color: #f4f4f5;
    border-color: #e9e9eb;
    color: #909399;
  }
  &-success {
    background-color: #f0f9eb;
    border-color: #e1f3d8;
    color: #67c23a;
  }
  &-warning {
    background-color: #fdf6ec;
    border-color: #faecd8;
    color: #e6a23c;
  }
  &-danger {
    background-color: #fef0f0;
    border-color: #fde2e2;
    color: #f56c6c;
  }  
  &-close{
    font-size: 12px;
    margin-left: 5px;
  }
  &-small{
    height: 20px;
    padding: 0 5px;
    line-height: 19px;
  }
}
</style>
