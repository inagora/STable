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

		return createElement(
			this.nativeType,
			{
				'class': ['st-btn', 'st-btn-'+this.type, 'st-btn-'+this.size]
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
	color: #212529;
	text-align: center;
	vertical-align: middle;
	-webkit-user-select: none;
	user-select: none;
	background-color: transparent;
	border: 1px solid transparent;
	padding: .375rem .75rem;
	font-size: 1rem;
	line-height: 1.5;
	border-radius: .25rem;
	transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
	margin: 0;
	font-family: inherit;
	cursor: pointer;
	
	&:disabled{
		cursor: not-allowed;
		opacity: 0.65;
	}

	&-large{
		padding: .5rem 1rem;
		font-size: 1.25rem;
		line-height: 1.5;
		border-radius: .3rem;
	}
	&-small{
		padding: .25rem .5rem;
		font-size: .875rem;
		line-height: 1.5;
		border-radius: .2rem;
	}
	
	&-default {
		background-color: #fff;
		border-color: #ccc;
	}
	&-default:hover {
		background-color: #e6e6e6;
		border-color: #adadad;
	}
	&-primary{
		color: #fff;
		background-color: #007bff;
		border-color: #007bff;
	}
	&-primary:hover {
		color: #fff;
		background-color: #0069d9;
		border-color: #0062cc;
	}
	&-success {
		color: #fff;
		background-color: #28a745;
		border-color: #28a745;
	}
	&-success:hover {
		color: #fff;
		background-color: #218838;
		border-color: #1e7e34;
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
		color: #212529;
		background-color: #ffc107;
		border-color: #ffc107;
	}
	&-warning:hover {
		color: #212529;
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
		text-decoration: underline;
	}

	& > &-icon + &-text{
		margin-left: 8px;
	}

}
</style>