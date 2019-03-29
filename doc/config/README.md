# STable配置
STable的使用，大部分时间都是在和各种配置参数打交道。

因为STable有过多次升级，有些参数的名字和格式发生了变化。鉴于对以往版本的兼容，参数尽量不变。如果有变化的，我们会标记出来。大致有两类：
	
* 不推荐使用的(deprecation)，我们以<sup style="color:red">dep</sup>标识
* 有调整的(modify)，我们以<sup style="color:green">mod</sup>标识

## actionMethods
* 类型：Object
* 默认值：
```javascript
{
	create: 'POST',
	read: 'GET',
	update: 'POST',
	destroy: 'POST'
}
```
* 详细：不同请求所使用的请求方法，包括列表、添加、修改、删除。
* 参考：
	* [crud操作](/demo/edit)

## addUrl
* 类型：String
* 详细：
添加数据时的提交地址。如果有此参数，会在工具栏toolbar自动显示一个“添加”按钮。
* 参考：
	* [crud操作](/demo/edit)
	* [请求方法 actionMethods](#action-methods)


## batDeleteUrl
* 类型：String
* 详细：
批量删除数据时的提交地址。如果有此参数，会在工具栏toolbar自动显示一个“删除”按钮，点此按钮，会把所有选中行删除。需要配合参数selectMode使用。
* 参考
	* [crud操作](/demo/edit)
	* [行选择模式 selectMode](#select-mode)

## columns
* 类型：Array
* 详细：
列配置。数据中的每一项对应表格中的一列，通过它配置此列的表头、表格内容以及展示样式。
* 参考:
	* [column配置](#column-config)


## deleteUrl
* 类型：String
* 详细：
删除数据时的提交地址。如果有此参数，会在每一行的最后添加一列，此列中有一个“删除”按钮，点此按钮，会删除此行。
* 参考：
	* [crud操作](/demo/edit)

## downloadable
* 类型：Boolean|String
* 默认值：false
* 详细：
此参数的可选值有以下四种：
	* true，在工具栏toolbar同时显示“导出当前页”和“导出所有页”两个按钮
	* false，不会显示下载按钮
	* 'single'，只显示“导出当前页”按钮
	* 'all'，只显示“导出所有页”按钮
* 参考：
	* [download](/demo/download)

## downloadAllFromJustOnePage
* 类型：Boolean
* 默认值：false
* 详细：全量下载表格时，会分页把所有数据请求下来。不过有时候分页请求数据反而没有一次性把所有数据导出来快。为了解决这个问题，可以使用这个变量。把它设置为true，全量导出时，只发出一页的请求，并且参数 count 值为 "max"，以标识这次请求希望能把符合要求的所有数据一次数请求到。

## downloadTimeout
* 类型：Number
* 默认值：10000
* 详细：
毫秒数。全量下载所有数据时，会分页面请求数据，可以用此参数指定每个页面请求的超时时间。如果超时，会中断请求，重新发起一个。有些请求耗时很长时，请指定一个比较大的时间。

## editConfig
* 类型：Array
* 详细：
添加或编辑行数据record时，弹窗中表单项的详细设置。
* 参考：
	* [crud操作](/demo/edit)
	* [表单项配置](/config/form.md)

## el
* 类型：String|Dom
* 默认值：'#wdStableContainer'
* 详细：
el指定STable在页面中的dom容器，它可以是css选择器，也可是一个dom。
> STable4、5中，因为与页面框架的配合，STable初始化时大部分情况下不需要指定这个参数。

## groupBy
* 类型：Array|String
* 默认值: []
* 详细：根据指定的列进行合并分组。可以是指定个列的数组，按着顺序，先用第一个列的值进行合并组；然后对每个组，使用第二个列进行再次分组；以此类推。
* 参考：
 * [合并组](/demo/groupBy)

## idIndex
* 类型：String
* 详细：
crud操作中，修改或者删除行时，由此参数来唯一标识行数据，并发给服务端。
* 参考：
	* [crud操作](/demo/edit)

## labelVisible
* 类型：Boolean
* 默认值：true
* 详细：
搜索过滤项的名字标签是否显示。当搜索项太多时，把此参数设为false，可以让搜索区显得更为紧凑。
* 参考：
	* [搜索](/demo/search)

## sublistAt
* 类型：Array|String
* 默认值：[]
* 详细：
指定某些列的数据为数组，并且数据中的每一项，在此列以一行展示。
* 参考：
 * [子列表](/demo/sublistAt)

## listeners
* 类型：Object
* 详细：
STable会一些时机，触发一些钩子函数，通过事件的方式对外暴露，可以在这些事件触发时，用户做一些处理。有以下事件：
	* ready
		* 详细：在STable初始化之后就调用，适合作一些准备工作，如事件绑定、数据准备，类似于浏览器的domready
	* refresh
		* 详细：加载完新一页数据后触发
		* 参数：
			* list，数组，当前页面的数据
	* beforeadd
		* 详细：添加数据前触发。可以在此对要添加的数据在请求发送前做一些处理
		* 参数：
			* data，要添加的数据
		::: warning
		注意，如果beforeadd的触发函数返回了false，就会中断本次添加动作
		:::
	* add
		* 详细：添加一行数据后触发。
		* 参数：
			* responseData，服务端返回的结果
			* data，添加的数据
	* beforeedit
		* 详细：修改一行数据前触发。可以在此对要编辑的数据在请求发送前做一些处理
		* 参数：
			* data，要修改的数据
		::: warning
		注意，如果beforeedit的触发函数返回了false，就会中断本次修改动作
		:::
	* edit
		* 详细：修改一行数据后触发
		* 参数：
			* responseData，修改之后服务端返回的数据
			* rowData，修改的行数据
	* search
		* 详细：搜索时触发。可以在此对搜索参数在请求发送前做一些处理
		* 参数：
			* search，搜索使用的参数
		::: warning
		注意，如果search的触发函数返回了false，就会中断本次搜索动作
		:::
	* dataload
		* 详细：从网络下载一页新数据后触发。此时对数据还没有做任何处理。可以在此对原始数据做一些预处理。
		* 参数：
			* responseData，刚下载的原始数据

## page
* 类型：Number
* 默认值：1
* 详细：
初始加载的页号。
> 注意，页号从1开始。

## params
* 类型：object
* 详细：
从服务端拉取每页表格数据时，params中的值也会当做参数一起发送过去。使用这个字段，可以让开发者自定义一些参数，发给列表接口。比如，可以设置
```json
params: {
	count: 100
}
```
让每页请求100条数据，而不是默20条。

## rowNumberVisible
* 类型：Boolean
* 默认值：false
* 详细：
是否在行首显示行号。

## searchFilter
* 类型：array
* 详细：
搜索区域的配置。因为搜索区域本质上是一个form表单，搜索的配置是表单每一顶的配置
* 参考
	* [表单配置](/config/form.md)

## selectMode
* 类型：string
* 默认值：'none'
* 详细：
表格的选择模式。在单选框或复选框选择行之后，可以通过app的getSelectedRows接口获取所有选中的行。有以下三种模式：
	* 'none'，在表格行前面不显示选择按钮
	* 'single'，单选模式，在表格行前显示单选按钮
	* 'multiple'，多选模式，在表格行前显示多选按钮

## sortKey
* 类型：String
* 详细：
默认按哪个值排序，它决定请求页数据时，sort_key字段的值。

## sortDirection
* 类型：String
* 默认值：'asc'
* 详细
默认排序方向

## title
* 类型：String
* 详细：
标题。它也会用作下载时的默认文件标题。

## toolbar
* 类型：Array
* 详细：
表格顶部的工具栏，它的每一项就是一个按钮配置。
* 参考：
	* [按钮配置](/config/button.md)

## updateUrl
* 类型：String
* 详细：
修改行数据时的提交地址。如果有此参数，会在每一行的最后添加一列，此列中有一个“修改”按钮，点此按钮，会修改此行。
* 参考：
	* [crud操作](https://doc.wfxteam.com/demo/edit)
	* [请求方法 actionMethods](#action-methods)

## url
* 类型：String
* 详细：
请求每页数据的异步接口。
* 参考：
	* [请求方法 actionMethods](#action-methods)