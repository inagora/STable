# 请求和应答数据格式
## request
STable配置中最重要的一个参数是url，通过它请求表格数据；发送请求时会带上页号、排序、每页显示条数及搜索参数。

```javascript
STable.init({
	title: '分页和排序',
	url: '/ajaxList',
	columns: [{
		text: '商品名',
		dataIndex: 'goods_name',
		flex: 1
	},{
		text: '价格',
		dataIndex: 'final_price',
		sortable: true
	}]
});
```

上例中，数据请求地址为
```
http://[your domain]/ajaxList
```
请求有两个参数有两个
```
page: 1
count: 20
```
* page参数指名当前请求第1页的数据。通过在配置参数中改变[params.page](/config/README.md#params)的值，可以修改打开页面时默认显示哪一页
* count参数指定一个页面有多少条数据。通过在配置参数中改变[params.count](/config/README.md#params)的值，可以指定请求参数count的值。

```javascript
STable.init({
	url: '/ajaxlist',
	params: {
		page: 10,	//默认显示第10页
		count: 20	//一页显示20条数据
	}
});
```

:tophat:然后我们点击列头"价格"，表格会按价格排序，这时候的请求参数为
```
page: 1
count: 20
sort_key: final_price
sort_direction: ASC
```
* sort_key参数表明需要的数据要以final_price字段排序。通过在配置参数中改变[sortKey](/config/README.md#sortkey)的值，可以指定默认打开时的排序字段。
* sort_direction参数表明以升序排序。通过在配置参数中改变[sortDirection](/config/README.md#sortdirection)的值，可以指定默认打开时的排序方向。

下面是一个请求的截图
![请求格式](https://s2.wandougongzhu.cn/s/be/param_fbc10a.png)

## response
服务端返回的数据格式为Json，结构如下：

```javascript
{
	errno: 0,	//数字，errno为0表示正常返回数据，否则表示有错误发生
	errmsg: '',	//字符串，有错误发生时的错误描述
	data: {
		page: 1,	//数字，当前返回的是第几页的数据
		page_count: 13,	//数字，总共有多少页数据
		list: [	//数组，当前页所有行的数据
			{	//对应每一行的数据
				name: "hacci",
				discount: 9.5
			},
			{...}
		]
	}
}
```

比如下图就是一个正常数据的截图
![数据格式](https://s3.wandougongzhu.cn/s/9b/data_ddaa2a.gif)