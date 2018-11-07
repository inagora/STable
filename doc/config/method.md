# STable实例方法
## refresh([page])
刷新STable。会重新请求数据；如果指定了page参数，会刷新到page指定的页。
* 参数：
	* page，页号
* 返回值：null

## getSearchParam()
获取当前搜索区的form表单值。
* 返回值：Object，当前搜索区的form表单值

## getSelectedRows()
获取当前页面中所有选中行的数据。
* 返回值：Array，当前页面中所有选中行的数据组成的数组。

## layout()
让STable重新计算一次布局。当window resize的时候，STable会自动计算布局。但有时候STable用在一些特殊情况，比如用在Dialog组件里，然后Dialog缩放时，STable可能就变形了。此时可以调用layout方法，强制让它重新计算一次布局。