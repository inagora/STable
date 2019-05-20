* 尽量不要“使用嵌套规则，由前面的规则对后面的名称做限定”
	比如 
	.st-table .head{
		color: #191919;
	}
	因为后面简称的样式可能会被项目定义
	比如
	.head{
		color: red;
	}
	这样，样式就无意中被污染了。
	建议使用全量的前缀，比如上面的例子可以写为：
	.st-table-head{
		color: #191919;
	}
	如果有好多样式，前缀都一样，可以使用scss来书写，以便编码时简化，如：
	.st-table{
		&{
			background: #fff;
		}

		&-head{
			color: #191919;
		}

		& &-empty{
			background: #f5f5f5;
		}

		.st-divider{
			width: 1px;
		}
	}
	上面css类名都跟.st-table有关系，最后会编译为
	.st-table{
		background: #fff;
	}
	.st-table-head{
		color: #191919;
	}
	.st-table .st-table-empty{
		background: #f5f5f5;
	}
	.st-table .st-divider{
		width: 1px;
	}
* scoped css，对它的使用没有要求