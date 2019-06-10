<script>
const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
export default {
	props: {
		size: {
			default: 'medium'
		},
		type: {
			default: 'default'
		},
		icon: {
			default: ''
		},
		nativeType: {
			default: 'button'
		}
	},
	render(createElement) {
		let children = [];
		let vnodes = this.$slots.default;
		if(vnodes && vnodes.length>0) {
			if(vnodes.length > 1 || vnodes[0].tag) {
				children = vnodes;
			} else {
				let text = (vnodes[0].text||'').trim();
				if(rxTwoCNChar.test(text) && !this.icon) {
					text = text.split('').join(' ');
				}
				children.push(createElement(
					'span',
					{
						'class': 'st-btn-text'
					},
					text
				));
			}
		}
		if(this.icon){
			children.unshift(createElement(
				'i',
				{
					'class': 'st-btn-icon '+this.icon
				}
			));
		}
		let size = 'md';
		if(this.size=='large')
			size = 'lg';
		else if(this.size=='small')
			size = 'sm';
		return createElement(
			this.nativeType,
			{
				'class': ['st-btn', 'st-btn-'+this.type, 'st-btn-'+size]
			},
			children
		);
	}
}
</script>

<style lang="scss">
.st-btn{
	display: inline-block;
	font-weight: 400;
	line-height: 1.499;
	color: #212529;
	text-align: center;
	vertical-align: middle;
	-webkit-user-select: none;
	user-select: none;
	background-color: transparent;
	border: 1px solid transparent;
	padding: 0 15px;
	font-size: 14px;
	height: 32px;
	border-radius: 4px;
	transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
	margin: 0;
	font-family: inherit;
	cursor: pointer;
	outline: none;
	
	&:disabled{
		cursor: not-allowed;
		opacity: 0.65;
	}

	&-icon{
		display: inline-block;
		vertical-align: middle;
	}
	&-text{
		display: inline-block;
		vertical-align: middle;
	}

	&-lg{
		padding: 0 15px;
		font-size: 16px;
		border-radius: 4px;
		height: 40px;
	}
	&-sm{
		padding: 0 7px;
		font-size: 12px;
		border-radius: 4px;
		height: 24px;
	}
	&-sm &-icon{
		font-size: 14px;
	}
	
	&-default {
		background-color: #fff;
		border-color: #d9d9d9;
	}
	&-default:hover {
		color: #409eff;
		border-color: #c6e2ff;
		background-color: #ecf5ff;
	}
	&-primary{
		color: #fff;
		background-color: #409eff;
		border-color: #409eff;
	}
	&-primary:hover {
		color: #fff;
		background: #66b1ff;
		border-color: #66b1ff;
	}
	&-success {
		color: #fff;
		background-color: #67c23a;
		border-color: #67c23a;
	}
	&-success:hover {
		color: #fff;
		background: #85ce61;
		border-color: #85ce61;
	}
	&-danger {
		color: #fff;
		background-color: #dc3545;
		border-color: #dc3545;
	}
	&-danger:hover {
		color: #fff;
		background-color: #c82333;
		border-color: #bd2130;
	}
	&-warning {
		color: #fff;
		background-color: #ffc107;
		border-color: #ffc107;
	}
	&-warning:hover {
		color: #fff;
		background-color: #e0a800;
		border-color: #d39e00;
	}
	&-info {
		color: #fff;
		background-color: #17a2b8;
		border-color: #17a2b8;
	}
	&-info {
		color: #fff;
		background-color: #17a2b8;
		border-color: #17a2b8;
	}
	&-link {
		font-weight: 400;
		color: #007bff;
		text-decoration: none;
	}
	&-link:hover {
		color: #0056b3;
	}
	&-link:hover &-text{
		text-decoration: underline;
	}

	&-icon + &-text{
		margin-left: 8px;
	}

	&-sm > &-icon + &-text{
		margin-left: 4px;
	}

}
</style>