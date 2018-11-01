# STable配置 {#stable-config}
---
STable的使用，大部分时间都是在和各种配置参数打交道。

因为STable有过多次升级，有些参数的名字和格式发生了变化。鉴于对以往版本的兼容，参数尽量不变。如果有变化的，我们会标记出来。大致有两类：
	
* 不推荐使用的(deprecation)，我们以<sup style="color:red">dep</sup>标识
* 有调整的(modify)，我们以<sup style="color:green">mod</sup>标识

#### actionMethods<sup style="color:green;font-size:0.6em">mod</sup> {#action-methods}
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

#### addUrl {#add-url}
* 类型：String
* 详细：
添加数据时的提交地址。如果有此参数，会在工具栏toolbar自动显示一个“添加”按钮。
* 参考：
	* [crud操作](/demo/edit)
	* [请求方法 actionMethods](#action-methods)

#### batDeleteUrl {#bat-delete-url}
* 类型：String
* 详细：
批量删除数据时的提交地址。如果有此参数，会在工具栏toolbar自动显示一个“删除”按钮，点此按钮，会把所有选中行删除。需要配合参数selectMode使用。
* 参考
	* [crud操作](/demo/edit)
	* [行选择模式 selectMode](#select-mode)

#### columns {#columns}
* 类型：Array
* 详细：
列配置。数据中的每一项对应表格中的一列，通过它配置此列的表头、表格内容以及展示样式。
* 参考:
	* [column配置](#column-config)


#### deleteUrl {#delete-url}
* 类型：String
* 详细：
删除数据时的提交地址。如果有此参数，会在每一行的最后添加一列，此列中有一个“删除”按钮，点此按钮，会删除此行。
* 参考：
	* [crud操作](/demo/edit)

#### downloadable {#downloadable}
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

#### downloadTimeout {#download-timeout}
* 类型：Number
* 默认值：10000
* 详细：
毫秒数。全量下载所有数据时，会分页面请求数据，可以用此参数指定每个页面请求的超时时间。如果超时，会中断请求，重新发起一个。有些请求耗时很长时，请指定一个比较大的时间。

#### editConfig {#edit-config}
* 类型：Array
* 详细：
添加或编辑行数据record时，弹窗中表单项的详细设置。
* 参考：
	* [crud操作](/demo/edit)
	* [表单项配置](form_config.md)

#### el<sup style="color:green;font-size:0.6em">mod</sup> {#el}
* 类型：String|Dom
* 默认值：'#wdStableContainer'
* 详细：
el指定STable在页面中的dom容器，它可以是css选择器，也可是一个dom。
> STable4、5中，因为与页面框架的配合，STable初始化时大部分情况下不需要指定这个参数。

#### idIndex {#id-index}
* 类型：String
* 详细：
crud操作中，修改或者删除行时，由此参数来唯一标识行数据，并发给服务端。
* 参考：
	* [crud操作](/demo/edit)

#### labelVisible<sup style="color:green;font-size:0.6em">mod</sup> {#label-visible}
* 类型：Boolean
* 默认值：true
* 详细：
搜索过滤项的名字标签是否显示。当搜索项太多时，把此参数设为false，可以让搜索区显得更为紧凑。
* 参考：
	* [搜索](/demo/search)

#### listeners {#listeners}
* 类型：Object
* 详细：
STable会一些时机，触发一些钩子函数，通过事件的方式对外暴露，可以在这些事件触发时，用户做一些处理。有以下事件：
	* ready
		* 详细：
		在STable初始化之后就调用，适合作一些准备工作，如事件绑定、数据准备，类似于浏览器的domready
	* refresh
		* 参数：
			* list，数组，当前页面的数据
		* 详细：
		加载完新一页数据后触发
	* afteradd
		* 参数：
			* res，添加之后，服务端返回的结果
		* 详细：
		添加一行数据之后触发。
	* afteredit
		* 参数：
			* rowData，修改前的行数据
			* res，修改之后服务端返回的数据
		* 详细：
		修改一行数据后触发
	* search
		* 参数
			* search，搜索使用的参数
		* 详细
		搜索时触发

		> 注意，如果search的触发函数中明确返回了false结果，就会阻止本次搜索的发出

#### page {#page}
* 类型：Number
* 默认值：1
* 详细：
初始加载的页号。
> 注意，页号从1开始。

#### params {#params}
* 类型：object
* 详细：
从服务端拉取每页表格数据时，params中的值也会当做参数一起发送过去。使用这个字段，可以让开发者自定义一些参数，发给列表接口。比如，可以设置
```json
postData: {
	"count": 100
}
```
让每页请求100条数据，而不是默20条。

#### postData<sup style="color:red;font-size:0.6em">dep</sup> {#post-data}
> 请使用params参数

* 参考：
	* [参数params](#params)

#### requestMethod<sup style="color:red;font-size:0.6em">dep</sup> {#request-method}
> 请使用actionMethods参数代替。

* 类型：string
* 默认值：'GET'
* 详细：
请求列表数据时，使用的方法。
* 参考：
	* [参数actionMethods](#action-methods)

#### rowNumberVisible {#row-number-visible}
* 类型：Boolean
* 默认值：false
* 详细：
是否在行首显示行号。

#### searchFilter {#search-filter}
* 类型：array
* 详细：
搜索区域的配置。因为搜索区域本质上是一个form表单，搜索的配置是表单每一顶的配置
* 参考
	* [表单配置](form_config.md)

#### selectMode<sup style="color:green;font-size:0.6em">mod</sup> {#select-mode}
* 类型：string
* 默认值：'none'
* 详细：
表格的选择模式。在单选框或复选框选择行之后，可以通过app的getSelectedRows接口获取所有选中的行。有以下三种模式：
	* 'none'，在表格行前面不显示选择按钮
	* 'single'，单选模式，在表格行前显示单选按钮
	* 'multiple'，多选模式，在表格行前显示多选按钮

#### title {#title}
* 类型：String
* 详细：
标题。它也会用作下载时的默认文件标题。

#### toolbar {#toolbar}
* 类型：Array
* 详细：
表格顶部的工具栏，它的每一项就是一个按钮配置。
* 参考：
	* [按钮配置](button_config.md)

#### updateUrl {#update-url}
* 类型：String
* 详细：
修改行数据时的提交地址。如果有此参数，会在每一行的最后添加一列，此列中有一个“修改”按钮，点此按钮，会修改此行。
* 参考：
	* [crud操作](https://doc.wfxteam.com/demo/edit)
	* [请求方法 actionMethods](#action-methods)

#### url {#url}
* 类型：String
* 详细：
请求每页数据的异步接口。
* 参考：
	* [请求方法 actionMethods](#action-methods)



# column配置 {#column-config}
---

#### buttons {#col-buttons}
* 类型：Array
* 详情
如果设置了buttons，那此列的类型type为自动认为是'button',会显示为按钮。

#### cellWrap {#cell-wrap}
* 类型：Boolean
* 默认：true
* 详情
如果cell中内容超出了cell的宽度，如何处理。为true，自动换行；为false，自动隐藏

#### cls {#col-cls}
* 类型：string
* 详细：
表格体中，此列附加的class样式名。

#### dataIndex {#data-index}
* 类型：String
* 详细：
指定此列对应的数据项，它决定了此列显示什么。列的配置被存储下来时，也以它为基础。如果没有指定此项的值，系统为自动生成一个。

#### flex {#flex}
* 类型：Number
* 详细：
此列宽度所占可分配总宽度的比重。

#### header {#header}
* 类型：String
* 详细：
此列在表头显示的标题内容

#### locked {#locked}
* 类型：Boolean
* 默认：false
* 详情
列是不是被锁定。锁定的列显示在表格左边，不会随底部滚动条一起移动。

#### render {#render}
* 类型：Function
* 参数：
	* rowData，此列的数据内容
	* columnConfig，此列的列配置
* 详细：
	自定义此列的内容展示。要求render函数返回要显示的内容字符串，可以是html代码。这是最灵活的展示方式了，完全由使用者自定义。

#### sortable {#sortable}
* 类型：Boolean
* 默认值：false
* 详细：
此列是否可排序。如果为true，那在点击表头此列时，会以此列dataIndex为sort_key，进行数据请求。

#### style {#col-style}
* 类型：Object
* 详细：
表格体中，此列附加的样式。

#### type<sup style="color:green;font-size:0.6em">mod</sup> {#col-type}
* 类型：string
* 默认值：'text'
* 详细：
大部分情况下，不用指定此项的值，STable会根据是否有list、buttons、checkbox、radio等参数，自动判断type类型。不过下拉选择有三种状态，select、combobox、multiple，它们都依赖于list，需要时要明确指定type的值。type可选的值有：
	* 'text'，直接显示dataIndex对应的文本内容
	* 'button'，显示为按钮
	* 'image'，显示为图片
	* 'tag', 带颜色的文字

#### width {#col-width}
* 类型：Number
* 详细：
此列的固定宽度，以px为单位。


# 表单配置 {#form-config}
---
添加、修改行数据时，出现的弹窗中是一个表单；搜索区也是一个表单。下面是表单项的配置。

#### asyncList {#async-list}
* 类型：string|function
* 详细：
通过list设置的列表数据是同步，但有时候，这个列表很长，导致数据很大，页面加载慢。这时候使用异步列表就很合适。在STable初始化之后，才会异步去获取list数据。asyncList支持两种模式：
	* string，如果asyncList是一个地址，它表示通过个接口拉取列表，返回的数据格式为
	```json
	{
			errno: 0,
			errmsg: '',
			data: {
					list: []
			}
	}
	```
	list即我们需要的列表内容。
	* function，如果asyncList为一个函数，那这个函数的返回值是一个promise，它resolve的值即为list数组。

#### hidden {#hidden}
* 类型：boolean
* 默认值：false
* 详细：
当前表单项是否可见。有一些值需要一起提交，但不想展示给使用者，就可以设置hidden为true。

#### label {#label}
* 类型：string
* 详细：
此表单项的标签，显示在输入框前面。

#### list {#form-list}
* 类型：array
* 详情
下拉选择的项。标准形式为
```javascript
list: [{text:'北京', value:'bj'},{text:'上海', value:'sh'},{text:'东京', value:'tokyo'}]
```
这个下拉选择有三个待选项，text是看到的内容，value是选择的值。另外，还有简写的方式。
```javascript
list:['北京', '东京', '上海']
```
它会翻译成标准形式如下：
```javascript
list:[{text:'北京', value:'北京'},{text:'东京', value:'东京'},{text:'上海', value:'上海'}]
```
还有一种简写方式
```javascript
list:{'bj':'北京','sh':'上海','tokyo':'东京'}
```
它翻译成标准形式如下：
```javascript
list: [{text:'北京', value:'bj'},{text:'上海', value:'sh'},{text:'东京', value:'tokyo'}]
```
> 不过，这种方式翻译之后，不能保证数组顺序。

#### name {#form-name}
* 类型：string
* 详细：
当前表单项提交时的key。

#### pattern {#pattern}
* 类型：string
* 详细：
表单的验证正则。这个配置虽然是个字符串，但它会直接赋值给input的pattern属性，所以它本身是一个正则发达式。

#### placeholder {#placeholder}
* 类型：string
* 详细：
输入框为空时的提示。如果此配置为空，为使用label的值做为placeholder。

#### readonly {#readonly}
* 类型：boolean
* 默认值：false
* 详细：
当前表单项是否只读。

#### required {#required}
* 类型：boolean
* 默认值：false
* 详细：
当前表单项必须有值，如果没有值，不准提交。

#### title {#form-title}
* 类型：string
* 详细：
input输入验证失败时，比如正则验证失败、required为true但内容没有填写时，会显示title内容的提示。

#### type {#form-type}
* 类型：string
* 详细：
指定表单项的类型，现支持以下几种类型：
	* text，显示为一个普通的文本输入框
	* date，显示一个日期选择器
	* year，显示一个年份选择器
	* month，显示一个月选择器
	* time，显示一个时间选择器
	* minute，显示一个小时和分钟选择器
	* datetime，显示一个日期+时间的选择器
	* number，显示为一个数字输入框
	* select，显示为一个普通的下拉选择
	* combobox，显示为一个带搜索过滤功能的下拉选择
	* multiple，显示为一个带搜索功滤、并且支持多选的下拉
	* file，显示为一个文件上传组件

#### format {#format}
* 类型：String
* 详细：
对于日期和时间选择器，它们都有自己的格式。如果你对它默认的格式不满意，可以用format自己设置。格式请参考[element-ui日期格式](http://element.eleme.io/#/zh-CN/component/date-picker#ri-qi-ge-shi)

#### value {#value}
* 类型：string|Number|Date
* 详细：
当前表单项的默认值。


# 按钮配置 {#button-config}
---
在toolbar和column配置时，都要用到按钮的配置。它有以下几个配置项：

#### click {#click}
* 类型：Function
* 详细：
	按钮点击时触发的函数。函数this指向STable实例。

	1. 用在toolbar时，它有两个参数：
		* btnConfig，此按钮的配置
		* event，当前点击事件

	1. 用在column时，它有三个参数：
		* record，当前行数据原始值
		* btnConfig，此按钮的配置信息
		* event，当前点击事件

#### cls {#button-cls}
* 类型：String
* 详细：
按钮上附加的样式class，用于自定义按钮样式。

#### icon {#button-icon}
* 类型：string
* 详细
对应font-awsome中的字体图标，比如icon:'plus'，就是在此按钮上显示一个glyphicon-plus图片，即一个加号图标。也支持element ui的icon。
* 参考：
	* [font awsome的图标](/resource/html/fa/)
	* [element ui的图标](http://element-cn.eleme.io/#/zh-CN/component/icon)

#### style {#button-style}
* 类型：Object
* 详细：
按钮上附加的style样式，用于自定按钮样式。

#### text {#button-text}
* 类型：string
* 详细：
按钮上显示的文本。

#### type<sup style="color:green;font-size:0.6em">mod</sup> {#button-type}
* 类型：string
* 默认值：'default'
* 详细：
对应bootstrap中对按钮类型的设定，它有 default / primary / success / warning / danger / info / text	。不同类型对应按钮的颜色不一样。

#### visible
* 类型：Boolean|<String,String>|Function
* 默认值：true
* 详细：
是否显示此按钮。仅对行中显示button有效。
	* 当visible为数组时，数组第一项为dataIndex，第二项为对比值，当某行中，dataIndex对应的数据和对比值一样时，才会显示此按钮。
	* 当visible为函数时，函数的返回值为true时，显示此按钮；否则不显示