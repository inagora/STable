# API

## 配置项
::: tip
对于一些即将过时的参数，我们会打上<sup style="color:red">dep</sup>标识。尽量不要使用这些参数，请根据建议使用替代方案。
:::
### acc
* __类型__: `Object`
* __详细__:

	是additionalColumnConfig的缩写。有时候列配置columns是从服务端下发的，但在页面里还需要用js做一些额外配置，就可以用这个参数配置。它是一个对象，每个key值对应一个列的dataIndex，value是对此列增加的配置。
* __用法__:
	```js
	//额外增加一些列设置
	acc: {
		actorName: {
			width: 200	//设置列actorName的宽度为200
		},
		avatar: {
			//列avatar增加render函数，展示一个图片
			render(record){
				return `<a href="/avatar/big/${record.id}" target="_blank"><img src="${record.avatar}"></a>`;
			}
		}
	}
	```
* __参考__:
	* <DemoViewer demo="api-acc" />

### actionMethods
* __类型__: `Object`
* __默认值__:
```
{
	create: 'POST',
	read: 'GET',
	update: 'POST',
	delete: 'POST'
}
```
* __详细__:

	不同时机请求所使用的请求方法，包括列表、添加、修改、删除。比如默认拉取列表的接口使用的http方法是 'GET'，但有些系统强制要求列表也要用'POST'方法，就可以此参数指定不同请求使有的方法类型。

* __用法__:
	``` js
	//把列表请求换成post方式
	actionMethods: {
		read: 'POST'
	}
	```
* __参考__:
	* <DemoViewer demo="actionMethods" />

### addConfig
* __类型__: `String`
* __详细__:

	添加数据时，弹窗内的form表单配置。它需要和addUrl配合使用。
	:::tip
	如果配置addConfig，STable会尝试使用updateConfig替代它。
	:::

* __参考__:
	* <DemoViewer demo="api-addConfig" />
	* [addUrl](#addurl)
	* [form配置](#form)

### addUrl
* __类型__: `String`
* __详细__:

	添加数据时的提交地址。如果有此参数，会在工具栏toolbar自动显示一个“添加”按钮，点击此按钮出现“添加”面板。它需要和addConfig配合使用。

* __参考__:
	* <DemoViewer demo="api-addConfig" />
	* [addConfig](#addconfig)

### batDeleteUrl
* __类型__: `String`
* __详细__: 

	批量删除数据时的提交地址。如果有此参数，会在工具栏toolbar自动显示一个“批量删除”按钮，点此按钮，会把所有选中行删除。需要配合参数selectMode和idIndex使用。
* __参考__: 
	* <DemoViewer demo="api-batDeleteUrl" />
	* [idIndex](#idindex)
	* [selectMode](#selectmode)

### columns
* __类型__: `Array`
* __详细__: 

	表格的列配置。数据中的每一项对应表格中的一列，通过它配置此列的表头、表格内容以及展示样式。
* __用法__: 
	如果只是简单的显示列的内容，可以直接写列对应的数据名：
	```javascript
	columns: ['name', 'age', 'gender']
	```
	对于有特殊要求的列，比如宽度、是否锁定，甚至要自己决定渲染内容的，可以用对象配置
	```javascript
	columns: [
		{
			dataIndex: 'name', //数据项
			width: 200,	//列宽度
			locked: true,	//锁定在左侧
			visible: true,	//可见
			resizable: false	//列的宽度不可缩放
		},
		{
			dataIndex: 'age',
			flex: 1,	//宽度
			cls: 'hl',	//此类应用的css样式名
		},
		{
			dataIndex: 'gender',
			//通过render函数，控制展示内容
			render(record){
				return record.gender==1?'male':'female';
			}
		}
	]
	```

	更多、更详细的列配置参数，请看 [column config](#columnconfig)
* __参考__:
	* [column api](#column)
	* <DemoViewer demo="api-columns" />

### componentOrder
* __类型__: `Array`
* __默认值__: [ 'title', 'tip', 'toolbar', 'search', 'table', 'pagination' ]
* __详细__: 

	STable由几个“部件”构成，分别是：标题(title)、提示(tip)、工具栏(toolbar)、搜索区(search)、表格(table)、分页栏(pagination)。通过componentOrder，我们可以对部件的展示顺序自己调整，比如想把工具栏显示在表格下面，就可以这样设置
	```js
	componentOrder: ['search', 'table', 'toolbar', 'pagination']
	```
* __参考__:
	* <DemoViewer demo="api-componentOrder" />

### deleteUrl
* __类型__: `String`
* __详细__:

	删除数据时的提交地址。如果有此参数，会在每一行的最后添加一列，此列中有一个“删除”按钮，点此按钮，会删除此行。需要和参数`idIndex`配合使用。
* __参考__: 
	* <DemoViewer demo="api-deleteUrl" />
	* [idIndex](#idindex)

### downloadable
* __类型__: `Boolean|String`
* __默认值__: false
* __详细__: 

	控制导出表格按钮的显示。点击“导出当前页”可以下载当前页的数据；点击“导出所有页”会把所有页的数据都下载下来。可选的值有：
	* true，在工具栏toolbar同时显示“导出当前页”和“导出所有页”两个按钮
	* false，不会显示下载按钮
	* 'single'，只显示“导出当前页”按钮
	* 'all'，只显示“导出所有页”按钮
* __参考__:
	* <DemoViewer demo="api-downloadable" />

### downloadAllFromJustOnePage
* __类型__: `Boolean`
* __默认值__: false
* __详细__: 

	全量下载表格时，会分页把所有数据请求下来。不过有时候分页请求数据反而没有一次性把所有数据导出来快。为了解决这个问题，可以使用这个变量。把它设置为true，全量导出时，只发出一页的请求，并且参数 count 值为 "max"，以标识这次请求希望能把符合要求的所有数据一次数请求到。

### downloadTimeout
* __类型__: `Number`
* __默认值__: 30000
* __详细__: 

	超时时间(毫秒)。全量下载所有数据时，会分页面请求数据，可以用此参数指定每个页面请求的超时时间。如果超时，会中断请求，重新发起一个。
* __参考__:
	* <DemoViewer demo="api-downloadTimeout" />

### el
* __类型__: `String|HTMLElement`
* __默认值__: "#stableContainer"
* __详细__: 

	STable在页面中的容器，它可以是css选择器，也可是一个dom元素。
* __参考__:
	* <DemoViewer demo="api-el" />

### idIndex
* __类型__: `String`
* __详细__: 

	修改或者删除行时，由此参数来唯一标识行数据，并发给服务端。
* __参考__:
	* [updateUrl](#updateurl)
	* [deleteUrl](#deleteurl)

### ignoreEmptySearchParam
* __类型__: `Boolean`
* __默认值__: true
* __详细__: 

	忽略搜索条件中空字符串的项，在请求页数据时，不带上它们
* __参考__: 
	* <DemoViewer demo="api-ignoreEmptySearchParam" />

### labelVisible
* __类型__: `Boolean`
* __默认值__: true
* __详细__: 

	搜索区的表单的标签是否显示。当搜索项太多时，把此参数设为false，可以让搜索区显得更为紧凑。
* __参考__: 
	* <DemoViewer demo="api-labelVisible" />

### layoutMode
* __类型__: `String`
* __默认值__: "fixed"
* __详细__: 

	stable所在区域的布局，有下面两个值：
	* "fixed"，固定高度模式。STable所在区域高度固定，会根据总体高度、工具栏、搜索区和分页区，决定表格区的高度
	* "expand"，自动伸展模式。STable高度不固定，根据表格区行数不同，自动调整STable的高度。
* __参考__: 
	* <DemoViewer demo="api-layoutMode-absolute" />
	* <DemoViewer demo="api-layoutMode-flex" />
	* <DemoViewer demo="api-layoutMode-expand" />

### listeners
* __类型__: `Object`
* __详细__: 

	STable在不时机触发一些钩子函数，开发者可以在这些时机做一些自己的功能。
* __用法__: 
	```javascript
	listeners: {
		ready(){
			$.get('/log/stableCreate').then(()=>{
				//在STable初始化之后，向服务端打点
			});
		},
		refresh(records){
			//数据刷新之后，可以对数据做一些处理
			let count = records.length;
			console.log(`we get ${count} records`);
		}
	}
	```
* __参考__: 
	* [事件](#事件)

### locale
* __类型__: `String|Object`
* __详细__: 

	STable使用的语言配置。
* __参考__: 
	* <DemoViewer demo="api-locale" />
	* [locale词典](https://github.com/inagora/STable/tree/master/src/lang)

### page
* __类型__: `Number`
* __默认值__: 1
* __详细__: 
  
	初始加载的页号。注意：`计数从1开始`。
* __用法__: 
	```JS
	//STable直接加载第10页
	page: 10
	```
* __参考__:
	* <DemoViewer demo="api-page" />

### pageMode
* __类型__: `String`
* __默认值__: "normal"
* __详细__: 

	分页模式。目前支持两种：
	* normal：模认的分页模式，需要通过页号和每页的行数，决定每一页的数据内容。
	* waterfall：瀑布流模式，需要根据当前页的第一行的pageIndex向前找上一页或者最后一行数据的pageIndex向后找一页的数据。
* __用法__: 
  ```JS
	//瀑布流模式
	pageMode: ‘waterfall’
	```
* __参考__:
	* <DemoViewer demo="api-pageMode-waterfall" />
	* [pageIndex](#pageindex)

### pageIndex
* __类型__: `String` 
* __默认值__: "id"
* __详细__: 

	如果分页模式是瀑布模式(waterfall)，需要指定由哪个数据字段决定分页
* __用法__: 
  ```JS
	//指定按page_id分页
	pageIndex: 'goods_id'
	```
* __参考__:
	* [pageMode](#pagemode)

### parallelCount
* __类型__: `Number` 
* __默认值__: 6
* __详细__: 

	全量下载表格时的并行请求数。因为目前浏览器一个域名的并行请求数一般为6个，所以设置的值超过6，并没有太大的意义。
	::: warning
	一般并行数越高，下载速度越快。但是，并行数越高，对服务器处理并发的能力要求就越高；如果服务器并发能力不够，可能会导致请求一直不返回，甚至超时；超时后会重新发起这个页面的数据请求，请求可能又会超时，如此往复，可能会引起雪崩。如果某个接口的服务承载能力不强，建议把这个值设置的小一些。
	:::
* __用法__: 
  ```JS
	//设置并行下载数为 3
	parallelCount: 3
	```
* __参考__:
	* <DemoViewer demo="api-parallelCount" />
	* [downloadable](#downloadable)

### params
* __类型__: `Object`
* __默认值__:
	```json
	params: {
		count: 20
	}
	```
* __详细__: 

	从服务器加载每页数据时，params中的值也会当做参数一起发送过去。使用这个配置，可以让开发者自定义一些参数，发给列表接口。比如，可以设置每页请求100行数据，而不是默认20行，同时带上一个额外参数color
	```javascript
	params: {
		count: 100,
		color: 'red'
	}
	```
* __参考__:
	* <DemoViewer demo="api-params" />

### records
* __类型__: `Array` 
* __详细__: 

	静态化数据，设置了它后，就不会动态加载页面数据了。直接渲染它定义的表格数据
* __用法__: 
  ```javascript
	//静态数据
	records: [
		{
			id: 1,
			name: '鳄鱼',
			movieType: '记录片',
			year: '2010'
		},
		{
			id: 2,
			name: '终结者2018',
			movieType: '科幻',
			year: '2018'
		}
	]
	```
* __参考__
	* <DemoViewer demo="api-records" />

### rowNumberVisible
* __类型__: `Boolean`
* __默认值__: false
* __详细__: 

	是否在行首显示行号。注意，只是当前页的行号，并不是所有页的总体序号。
* __用法__: 
  ```JS
	rowNumberVisible: true,
	```
* __参考__:
	* <DemoViewer demo="api-rowNumberVisible" />

### searchFilter
* __类型__: `array|Object`
* __详细__: 

	搜索区域的配置。因为搜索区域本质上是一个form表单，搜索配置其实是表单项的配置。
* __用法__: 
  ```javascript
	searchFilter: [
		{
			label: '名字',
			name: 'name'
		}
	]
	```
* __参考__:
	* [form表单配置](#form)
	* <DemoViewer demo="api-searchFilter" />

### searchResetable
* __类型__: `Boolean`
* __默认值__: false
* __详细__: 

	在搜索区是否显示“重置”按钮，点击后重置表单项为默认值
* __用法__: 
  ```JS
	//显示重置按钮
	searchResetable: true
	```
* __参考__
	* <DemoViewer demo="api-searchResetable" />

### selectMode
* __类型__: `String`
* __默认值__: "none"
* __详细__: 

	行的选择模式。在单选框或复选框选择行之后，可以通过STable的getSelected(<span style="color: red;">注：v1.x版本请使用getSelectedRows</span>)接口获取所有选中的行。有以下三种模式：
	* 'none'，在表格行前面不显示选择按钮
	* 'single'，单选模式，在表格行前显示单选按钮
	* 'multiple'，多选模式，在表格行前显示多选按钮
* __用法__: 
  ```JS
	//设置为单选模式
	selectMode: 'single'
	```
* __参考__:
	* <DemoViewer demo="api-selectMode-single" />
	* <DemoViewer demo="api-selectMode-multiple" />

### sortKey
* __类型__: `String`
* __详细__: 

	默认按哪个列排序，它决定请求页数据时，sort_key字段的值。
* __用法__: 
	```JS
	STable.init({
		//...other configs
		//按哪个字段值排序
		selectMode: 'id',
	});
* __参考__:
	* <DemoViewer demo="api-sortKey" />
	* [sortDirection](#sortdirection)

### sortDirection
* __类型__: `String`
* __默认值__:  "asc"
* __详细__: 

	同sortKey，sortDirection决定了默认排序方向。
	可选的值有：
	* 'asc'，正序
	* 'desc'，倒序
* __用法__: 
	```JS//设置默认排序方向
	sortDirection: 'asc'
	```
* __参考__:
	* <DemoViewer demo="api-sortDirection" />

### sublistAt
* __类型__: `Array|String`
* __详细__: 

	把指定列的每个单元格显示为多行。
	::: tip
	指定列的数据需要为一维数组，数组中的每一项在单元格中渲染为一行。
	:::
* __用法__: 
	```JS
	//设置子列表
	sublistAt: 'movieType'
	```
* __参考__: 
	* <DemoViewer demo="api-sublistAt" />

### toolbar
* __类型__: `Array`
* __详细__: 

	表格的工具栏，它里面是可以是按钮或分割符。目前支持的分割符有：
	* '|'，显示一个竖线分割
	* ' '，显示一个空白分割
* __用法__: 
  ```js
	toolbar: [
		//增加一个普通按钮
		{
			text: '删除',
			icon: 'st-iconfont st-icon-close',
			type: 'danger',
			click(){
				console.log(this.getSelectedRows())
			}
		},
		//增加一个分割线
		'|',
		//增加一个空白
		' ',
	]
	```
* __参考__: 
	* [button api](#button)
	* <DemoViewer demo="api-toolbar" />

### updateConfig
* __类型__: `Array`
* __详细__: 

	编辑一行数据时，弹窗中表单的详细设置。需要和参数`updateUrl`配合使用。
	:::tip
	如果设置了addUrl参数，但未设置addConfig，会使用editConfig做为添加数据的表单
	:::
* __参考__:
	* [form api](#form)
	* [updateUrl](#updateurl)
	* <DemoViewer demo="api-updateConfig" />

### updateUrl
* __类型__: `String`
* __详细__: 

	修改行数据时的提交地址。如果有此参数，会在每一行的最后添加一列，此列中有一个“修改”按钮，点此按钮，会显示修改窗口。
* __用法__: 
	```js
	updateUrl: '/demo/ajaxUpdate'
	```
* __参考__:
	* [updateConfig](#updateconfig)
	* <DemoViewer demo="api-updateConfig" />

### url
* __类型__: `String`
* __详细__: 

	请求每页数据的异步接口。
* __用法__: 
  ```js
	url: '/demo/ajaxList'
	```

## 事件
在STable操作的不同时机，会有各种事件触发。监听这些事件，可以特定时机完成一些特殊的工作。
::: tip
所有事件的监听函数中，`this`都指向当前STable实例。当然，如果你用箭头函数等方式，就另当别论了。
:::
### ready
* __详细__:

	在STable初始化之后触发。适合作一些准备工作，如事件绑定、数据准备，类似于浏览器的`DOMContentLoaded`事件。
	:::warning
	ready事件中，STable的初化工作完成，但数据不一定准备好了。
	:::
* __用法__: 
	```javascript
	//设置stable初始化完毕后做的事情
	listeners: {
		ready(){
			console.log('窗口初始化完毕');
		}
	}
	```
* __参考__:
	* <DemoViewer demo="listener-ready" />

### refresh
* __参数__:
	* records，`Array`，刷新后页面的数据 
* __详细__:

	加载完新一页数据后触发。可以真正渲染前，对原始数据做一些处理。
* __用法__: 
	```JS
	//设置刷新数据后，渲染前先对数据做的处理
	listeners: {
		refresh(records){
			console.log(`当前页共有${records.length}行`);
			records.forEach(r=>{
				//名字中的空白都换成下划线
				r.name = r.name.replace(/\s/g, '_');
			});
		}
	}
	```
* __参考__:
	* <DemoViewer demo="listener-refresh" />

### beforeadd
* __参数__:
	* data，`Object`，要添加的数据
* __详细__:

	添加数据前触发。可以在此时，对要添加的数据在请求发送前做一些处理，比如数据校验
	::: tip
	如果beforeadd的触发函数返回了false，就会中断本次添加动作。这个特性可以用来做数据提交前的检查，一旦发现有问题，可以用它中断添加动作。
	:::
* __用法__: 
	```javascript
	listeners: {
		beforeadd(data){
			let name = data.name;
			if(!name || name.length<10){
				alert('名字不能为空，且大于10个字符');
				return false;
			}
		}
	}
	```
* __参考__:
	* [addUrl](#addurl)
	* [addConfig](#addconfig)
	* <DemoViewer demo="listener-beforeadd" />

### add
* __参数__:
	* response，`Object`，本次请求的返回内容
	* data，`Object`，已添加的数据
* __详细__:

	添加数据后触发。此时可以拿到服务端返回的数据，然后对数据做一些处理
* __用法__: 
	```JS
	listeners: {
		add(response, data){
			if(response.errno==0){
				console.log(`adding record successed!`);
			} else {
				console.log('adding record failed!');
			}
		}
	}
	```
* __参考__:
	* [addUrl](#addurl)
	* [addConfig](#addconfig)
	* <DemoViewer demo="listener-add" />

### beforeedit
* __参数__:
	* data，`Object`，要编辑的数据
* __详细__:

	修改一行数据前触发。可以在此对要编辑的数据在请求发送前做一些处理，比如数据调整或校验。
	::: tip
	如果beforeedit的触发函数返回了false，就会中断本次修改动作
	:::
* __用法__: 
	```JS
	listeners: {
		beforeedit(data){
			let name = data.name;
			if(!name || name.length<10){
				alert('名字不能为空，且大于10个字符');
				return false;
			}
			//名字中的空格换成下划线
			data.name = data.name.replace(/\s/g,'_');
		}
	}
	```
* __参考__:
	* [updateUrl](#updateurl)
	* [updateConfig](#updateconfig)
	* <DemoViewer demo="listener-beforeedit" />



### edit
* __参数__:
  * response，`Object`，本次请求的返回内容
	* data，`Object`，编辑的数据
* __详细__:

	修改一行数据时触发。在此对要编辑的数据做处理和发送请求
* __用法__: 
	```JS
	listeners: {
		edit(res, data){
			if(res.errno){
				alert(res.errmsg);
			} else {
				alert(`the new name is ${data.name}`);
			}
		}
	}
	```
* __参考__:
	* [updateUrl](#updateurl)
	* [updateConfig](#updateconfig)
	* <DemoViewer demo="listener-beforeedit" />

### beforebatdelete
* __参数__:
	* records, `Array`, 被选中的数据行
* __详细__:
	点击批量删除按钮时触发。如果返回`false`，会阻止删除动作。
* __参考__:
	* <DemoViewer demo="listener-batdelete" />

### batdelete
* __参数__:
	* response, `Object`, 删除请求的返回内容
	* records, `Array`, 被选中的数据行
* __详细__:
	批量删除后触发。
* __参考__:
	* <DemoViewer demo="listener-batdelete" />

### beforedownload
* __参数__:
	* records, `Array`，要生成excel文件的数据
* __详细__:
	在导出数据时触发。注意，此时已经请服务端把所有数据都下载成功了，在beforeexport触发函数里，可以对数据进行预加工。
	::: tip
	如果触发函数返回false，就会阻止数据导出
	:::
* __参考__:
	* <DemoViewer demo="listener-download" />

### search
* __参数__:
  * data，`Object`，搜索的参数
* __详细__:

	在搜索u前触发，可在此时对参数做处理。
  ::: warning
	注意，如果search的触发函数返回了false，就会中断本次搜索动作
	:::
* __用法__: 
  ```js
	listeners: {
		search(data) {
			//对参数ids做处理
			if(data.ids) {
				data.ids = data.ids
					//根据空格、逗号和竖线分割
					.split(/[ ,|]/)
					//去掉空白字符
					.map(item=>item.trim())
					//只留下由数字组成的字符串
					.filter(item=>/^\d+$/.test(item));
				//如果处理后没有合格的id了，就阻止本次搜索
				if(data.ids.length<=0) {
					alert('请填写正确的id');
					return false;
				} else {
					//把合格的id用竖线拼接，提交给服务端
					data.ids = data.ids.join('|');
				}
			}
		}
	}
	```
* __参考__:
	* <DemoViewer demo="listener-search" />

### beforedatarequest
* __参数__:
	* requestOption，`Object`，包括请求的url地址、请求参数和方法：
		* url，`String`，请求地址
		* data，`Object`，请求参数
		* method，`String`，请求方法，如"GET"、"POST"
		* timeout，`Number`，请求超时的毫秒数，默认30000（30秒）。
* __详细__:

	发送请求前可用此方法对参数进行校验和处理。比如修改请求地址
	```javascript
	listeners: {
		beforedatarequest(req) {
			let {url, data, method} = req;
			//处理url
			req.url = url+'?type=1';
			//如果请求的count大于100，阻止本次请求
			if(data.count>100)
				return false;
			data.name = '天空';
			req.data = data;
		}
	}
	```
	可以修改原始请求对象，也可以直接拼装一个请求对象，然后返回
	```javascript
	listeners: {
		beforedatarequest(req) {
			if(req.data.type=='test'){
				return {
					url: '/ajaxTest',
					data: {
						type: 'test',
						count: 10
					},
					method: 'post'
				}
			}
		}
	}
	```
	::: tip 
	如果事件函数返回了`false`，会阻止本次请求。
	:::
* __参考__: 
	* <DemoViewer demo="listener-beforedatarequest" />

### dataload
* __参数__:
	* response，`Object`，刚下载的原始数据
* __详细__:
  
	从网络下载一页新数据后触发。此时对数据还没有做任何处理。可以在此对原始数据做一些预处理。
* __用法__: 
  ```js
	listeners: {
		dataload(res) {
			res.data.list.forEach(record=>{
				record.name = record.replace(/ /g, '-');
			});
		},
	}
	```
* __参考__: 
	* <DemoViewer demo="listener-dataload" />

### rowclick
* __参数__:
	* record, `Object`，被点击的行数据
	* event，`MouseEvent`，点击事件
* __详细__:
	当表格某一行被点击时触发。
* __参考__: 
	* <DemoViewer demo="listener-rowclick" />

### cellclick
* __参数__:
	* record, `Object`，被点击的行数据
	* colConfig, `Object`，被点击列的配置
	* event，`MouseEvent`，点击事件
* __详细__:
	当表格单元被点击时触发。
* __参考__: 
	* <DemoViewer demo="listener-cellclick" />

## 实例方法

### refresh
* __参数__:
	* pageNo，`Number`，要刷新到的页号。如果没有指定`pageNo`，就刷新当前页
* __详细__:

	刷新表格。当对数据做了改动，或者想主动刷新表格，可以调用refresh方法。
* __参考__: 
	* <DemoViewer demo="method-refresh" />

### layout
* __详细__:

	重新刷新布局。比如浏览器窗口大小有变化，需要STable同步变化时，可以调用这个接口

* __参考__: 
	* <DemoViewer demo="method-layout" />

### getSelected
* __详细__:

	获取table表格中选中的行，返回值为数组。
* __参考__: 
	* <DemoViewer demo="btn-click" />
	* <DemoViewer demo="api-selectMode-multiple" />
	* <DemoViewer demo="api-toolbar" />

### getSearchParam
* __详细__:

	获得当前搜索表单内容。
* __参考__: 
	* <DemoViewer demo="method-getSearchParam" />

### setRecords
* __参数__:
	* records, `Array`，要设置的数据数组。
* __详细__:

	设置表格数据。一般情况下，我们的数据都是从服务端拉取的；但可以通过这个接口，用程序设置数据，让STable的更新更灵活。
* __参考__: 
	* <DemoViewer demo="method-setRecords" />


### getToolbarBtn
* __参数__:
	* idx, `String|Number|null`，要获得的按钮id或者序号。如果没传此参数，返回所有按钮
* __详细__:

	获得当前工具栏的按钮。
* __参考__: 
	* <DemoViewer demo="btn-visible" />

## column
表格的列配置。通过它配置此列的表头、表格内容以及展示样式。一般情况下，它的配置如下：
```javascript
columns: [
	{
		text: '电影名',
		dataIndex: 'name'
	},
	{
		text: 'year',
		dataIndex: 'year'
	},
	{
		buttons: [
			{
				text: '删除',
				click(record){
					//删除操作
				}
			}
		]
	}
]
```
有时候，text和dataIndex一样的时候，可以采用简写方式
```javascript
columns: [
	'name', //等同于 { text: 'name', dataIndex: 'name' }
	'year', //等同于 { text: 'year', dataIndex: 'year' }
	{
		buttons: [
			{
				text: '删除',
				click(record){
					//删除操作
				}
			}
		]
	}
]
```

### buttons
* __类型__: `Array`
* __详细__:

	buttons中的每一项是一个按钮的配置。
	```javascript
	//比如下面配置了两列，第一列显示名字，第二列显示两个按钮
	columns: [
		{
			text: '名字',
			dataIndex: 'name'
		},
		{
			buttons: [
				{
					text: '删除',
					type: 'danger',
					click(){
						//delete this record
					}
				},
				{
					text: '提交',
					type: 'primary',
					click(){
						//submit this record
					}
				}
			]
		}
	]
	```
	列配置中的按钮也有visible属性，但它设置与普通按钮不一样。这里visible的取值有两种类型：
	* `Array`，数组中有两项，第一项为`dataIndex`，第二项为要比较的值。如果此行数据中，`dataIndex`对应的数据与第二项相等，此按钮才显示。
	* `Function`，函数有一个参数record(此行的原始数据)，此函数返回true时此按钮显示。
	```javascript
	columns: [
		{
			buttons: [
				{
					text: '删除',
					//'2012'年上映的电影，'删除'按钮才显示
					visible: ['year', '2012']
				},
				{
					text: '提交',
					//'2012'年后的电影，'提交'按钮才显示
					visible(record){
						return parseInt(record.year||0)>2012;
					}
				}
			]
		}
	]
	```
* __参考__：
	* [button api](#button)
	* <DemoViewer demo="column-buttons" />
	* <DemoViewer demo="column-buttons-visible" />

### cellWrap
* __类型__: `Boolean`
* __默认值__: true
* __详细__:

	单元格中的内容是不是自动换行。如果cellWrap为false，当内容超过单元格宽度时，自动截断，显示省略号
* __参考__:
	* <DemoViewer demo="column-buttons-visible" />

### click
* __类型__: `Function`
* __详细__:

	此列的单元格被点击时，触发的函数。函数的参数有：
	* `record`，此行的原始数据
	* `columnConfig`，此列的配置
	* `event`，点击事件
* __参考__:
	* <DemoViewer demo="column-click" />

### cls
* __类型__: `String`
* __详细__:

	此列的单元格应用的样式。
	::: tip
	有时候，只要表格体应用这个样式，表头不需要，可以通过在样式选择器上加上表格体样式(.st-table-body)来限制，只要表体内样式生效。
	```css
	.st-table-body .name-cell{
		color: red;
	}
	```
	:::
* __参考__:
	* <DemoViewer demo="column-cls" />

### dataIndex
* __类型__:	`String`
* __详细__:

	dataIndex有两个作用：
	1. 指明单元格中要显示的内容，它做为key取此行数据的内容；
	2. 做为列的唯一标识，所以dataIndex的值不能重复
	::: tip
	有时候我们并不会指定列的dataIndex参数，比如设置了列的buttons或者render参数后，`dataIndex`就不是必须的了。这时候STable其实还是会自动生成一个dataIndex，供内容使用。
	:::

### defaultOption
* __类型__: `String`
* __详细__:

	如果设置了options参数，当没有对应的可选项时，默认显示的内容。
* __参考__:
	* [options](#options)
	* <DemoViewer demo="column-options" />

### flex
* __类型__:	`Number`
* __详细__:

	以权重比例的方式设置此列的宽度。比如有三列A、B、C，它们的flex值分别是1、4、5，那么A列的宽度就是10%，B列40%，C列50%。
	::: tip
	如果有些列设置了width（绝对宽度），有些列设置了flex（比例宽度），那么flex计算时 `flex列总宽度`=`STable宽度`-`绝对列总宽度`。flex列按权重分flex列的总宽度
	:::
* __参考__:
	* [width](#width)
	* <DemoViewer demo="column-flex" />

### locked
* __类型__:	`Boolean|String`
* __默认值__:	false
* __详细__:

	设置此列是否固定，以及固定在左边还是右边。固定后此列就不会随着横向滚动条左右滑动。可取的值有：
	* true，此列固定在左侧
	* false，此列不固定
	* 'left'，固定在左侧
	* 'right'，固定在右侧
* __参考__:
	* <DemoViewer demo="column-locked" />

### options
* __类型__: `Object`
* __详细__:

	有时候我们并不想直接显示dataIndex指定的内容，而是想显示一个映射的内容。比如 `dataIndex: 'status'`，status对应的是一个数字，我们想让用户看到这个数字表示的文字描述，比如10表时已删除，20表示审核中。就可以用options实现这个功能。
	```javascript
	columns: [
		{
			text: '订单状态',
			dataIndex: 'status',
			options: {
				'10': '已删除',
				'20': '审核中',
				'30': '订单完成'
			}
		}
	]
	```
* __参考__:
	* [defaultOption](#defaultOption)
	* <DemoViewer demo="column-options" />

### render
* __类型__: `Function`
* __参数__:
	* `record`，此行的原始数据
	* `colConfig`，此列的配置
	* `recordIndex`，此行的行号，从0开始
* __详细__:

	一般情况下，通过`dataIndex`指定的数据就满足展示的需求了。但是，特殊情况下，需要对内容加工，比如，需要把内容做为一个url，赋值给一个img元素。render函数就是满足这种自定义展示内容需求的。
	```javascript
	columns: [
		{
			dataIndex: 'url',
			render(record){
				return `<img class="avatar" src="${record.url}" />`;
			}
		}
	]
	```
* __参考__:
	* <DemoViewer demo="column-render" />

### resizable
* __类型__:	`Boolean`
* __默认值__: true
* __详细__:

	设置此列在表头区域是否能拖动缩放。
* __参考__:
	* <DemoViewer demo="column-resizable" />

### sortable
* __类型__: `Boolean`
* __默认值__: false
* __详细__:

	设置点击此列头时，能否按此列数据对表格进行排序。`注意`，STable并不会直接排序，而是重新发起数据请求，加载第一页的数据。请求数据时，会带上sort_key、sort_order参数，以表明按哪列、哪个方向排序。其中sort_key为当前列的`dataIndex`值。
* __参考__:
	* <DemoViewer demo="column-sortable" />

### style
* __类型__:	`Object`
* __详细__:

	应用在此列上的样式。
	```javascript
	columns: [
		{
			text: '电影名',
			dataIndex: 'name',
			style: {
				color: 'red',
				fontWeight: 'bold'
			}
		}
	]
	```
* __参考__:
	* <DemoViewer demo="column-style" />

### text
* __类型__:	`String`
* __详细__:

	列头显示的名字。如果没有指定此项，但指定了`dataIndex`，会用dataIndex做为text的值。
	::: tip
	在之前的版本中，我们使用参数`header`来配置列名
	:::
* __参考__:
	* <DemoViewer demo="column-text" />

### visible
* __类型__:	`Boolean`
* __默认值__:	true
* __详细__:

	设置打开时此列是否可见。可以通过列头的设置菜单，手动调整哪些列可见。
* __参考__:
	* <DemoViewer demo="column-visible" />

### width
* __类型__:	`Number`
* __详细__:

	以绝对值设置此列的宽度。
* __参考__:
	* [flex](#flex)
	* <DemoViewer demo="column-flex" />

## form
* __介绍__:由输入框（input/textarea）、选择器(select)、单选框(radio)、多选框(checkbox)、开关（switch）、文件上传（file）等控件组成，用以收集、校验、提交数据。可以单独作为组件（无需注册）在vue中使用（x-form），也可集成在STable使用，一般情况下，它的配置如下：
  
	```html
	<div id="box">
		<x-form 
			ref="form"
			inline
			:field-list="formList"
			size="small"
			:label-visible="labelVisible"
			@submit="submit">
			<x-button type="submit"></x-button>
		</x-form>
	</div>
	```
  
  ```javascript
	new Vue({
		el: '#box',
		data() {
			return {
				formList: [
					{
						label: '电影名',
						name: 'movie_name',
						type: 'input',
					},
					{
						label: '电影类型',
						type: 'multiple',
						name: 'movie_type',
						value: ['type0','type1'],
						options: [{
							label: '动作',
							value: 'type0',
						},{
							label: '喜剧',
							value: 'type1',
						},{
							label: '记录片',
							value: 'type2',
						}]
					},
					{
						label: '荣获奖项',
						type: 'checkbox',
						name: 'movie_award',
						options: [
							{
								label: 'Oscar',
								value: '0',
							},
							{
								label: 'Cannes',
								value: '1',
							}]
					},
					{
						label: '是否提名',
						type: 'radio',
						name: 'movie_nomination',
						options: [{
							label: 'yes',
							value: true
						},{
							label: 'no',
							value: false
						}]
					},
					{
						label: '上映年份',
						name: 'year',
						type: 'date',
						format: 'YYYY'
					}
				],
				labelVisible: true,
			}
		},
		methods: {
			submit(formdata) {
				console.log(formdata);
			},
			reset() {
				this.$refs.form.reset();
			},
		}
	})
	```
* __参考__:
	* <DemoViewer demo="form" />


### inline
* __类型__:	`Boolean`
* __详细__:

	是否内联方式布局，默认false（无需配置），如需所有表单项展示在一行(如搜索)，请设置为`true`或配置此项。
* __参考__:
	* <DemoViewer demo="form-inline" />
  
### size
* __类型__:	`String`
* __详细__:

	表单尺寸。可选值有 `small|medium|large`，默认small。
* __参考__:
	* <DemoViewer demo="form-size" />
    
### label-visible
* __类型__:	`Boolean`
* __详细__:

	是否展示label标签。默认`true`。
* __参考__:
	* <DemoViewer demo="form-label" />

### submit
* __类型__:	`Function`
* __详细__:

	表单提交触发方法，按钮需要单独引入，详见[buttons](#buttons)。可在此方法中验证表单数据和发起请求。
* __参考__:
	* <DemoViewer demo="form-submit" />

### reset
* __类型__:	`Function`
* __详细__:

	表单提交重置方法，若表单项有默认值则重置为默认值，若无默认值则重置为空。按钮需要单独引入，详见[buttons](#buttons)。
* __参考__:
	* <DemoViewer demo="form-reset" />

### field-list 
* __类型__:	`Array`或者`Object`
* __概览__:

	1. 配置为Array：

	表单项配置，每个表单项配置都是`Object`类型。
	| 配置项 | 说明 |  类型  | 默认值 |
	| :-: | :-: | :-: | :-: |
	| name | 必填 | String | - |
	| label | 选填 | String | 值为name的值 |
	| type | 选填 | String | input |
	| value | 仅在type=input选填 | String | - |
	| list | 仅在type=multiple，type=combobox，type=cascader必填 | Array | [] |
	| width | 选填 | Number或String | - |
	| rules | 选填 | Array | [] |

	2. 配置为Object：

	如果搜索区功能比较简单，比如所有的搜索选项都为手动输入，则可以配置field-list为Object，STable会自动格式化为标准的类型。

* __参考__:
	* [field-list api](#field-list)
	* <DemoViewer demo="api-fieldList-array" />
	* <DemoViewer demo="api-fieldList-object" />

## field-list
### label
* __类型__: String
* __详细__:

	表单前的提示文案，如果没有配置该项或者field-list类型为Object，则该值同[name](#name)的值。

* __参考__:
	* <DemoViewer demo="api-fieldList" />

###	name
* __类型__: String
* __详细__:

	每个表单项对应的key，搜索的时候会拼接到URL上

* __参考__:
	* <DemoViewer demo="api-fieldList" />

### type
* __类型__: `String`
* __详细__:

	表单的类型，支持以下常用的几种：
* __type 的合法值:__
  
<table>
	<tr>
		<th>表单项名称</th>
		<th style="text-align:center">type值</th>
		<th style="text-align:center">可选值</th>
		<th>类型</th>
		<th>默认值</th>
		<th>说明</th>
	</tr>
	<tr>
		<td >表单输入框 </td>
		<td style="color:rgb(92, 184, 92)">input</td>
		<td> text/number </td>
		<td>`String`</td>
		<td>text</td>
		<td>number类型必须输入数字</td>
	</tr>
	<tr>
		<td >下拉选择框 </td>
		<td style="color:rgb(92, 184, 92)">select</td>
		<td> multiple/combobox/cascader </td>
		<td>`String`</td>
		<td>select</td>
		<td>multiple为下拉多选并可搜索、combobox为下拉单选并可搜索、cascader为级联选择且不可搜索</td>
	</tr>
	<tr>
		<td >时间选择器 </td>
		<td style="color:rgb(92, 184, 92)">date</td>
		<td> date/datetime </td>
		<td>`String`</td>
		<td>date</td>
		<td>可通过dateConfig修改日期的默认参数(更多配置可参考[flatpickr](https://flatpickr.js.org))</td>
	</tr>
	<tr>
		<td >文件上传 </td>
		<td style="color:rgb(92, 184, 92)">file</td>
		<td> file </td>
		<td>`String`</td>
		<td>file</td>
		<td>通过upload配置上传参数</td>
	</tr>
</table>

* __参考__:
	* <DemoViewer demo="api-fieldList-type-input" />
	* <DemoViewer demo="api-fieldList-type-select" />
	* <DemoViewer demo="api-fieldList-type-date" />
	* <DemoViewer demo="api-fieldList-type-file" />

### value
* __类型__: `String`
* __详细__:

	form表单的默认值

* __参考__:
	* <DemoViewer demo="api-fieldList-value" />

### list
* __类型__: `Array`
* __详细__:

	下拉框的选项，每一项为一个Object，可以设置显示的文案以及对应的值；如果其中的项为String类型，则会自动格式化为需要的Object格式。
	
	当type为multiple、combobox、cascader时需要传入该值；如果type为cascader时可嵌套设置list。

* __参考__:
	* <DemoViewer demo="api-fieldList-list" />

### width
* __类型__: `Number`/`String`
* __详细__:

	设置表单的宽度。

* __参考__:
	* <DemoViewer demo="api-fieldList-width" />

### rules
* __类型__: `Array`
* __详细__:

	该配置用于表单验证，如果某项表单的值不能通过设置的验证条件，则会给出相应的提示，并且阻止表单的提交。

	可支持的验证有：
	* required，必须有值
	* pattern，正则表达式，或者字符串
	* number，必须是数字
	* min/max，只对数字有效
	* length，只对字符串和数组有效(待实现)
	* validator，自定义验证函数，如果返回true，验证通过，如果返回字符串，当做错误提示显示

* __参考__:
	* <DemoViewer demo="api-fieldList-rules" />

## button

在toolbar、表格展示、form表单、dialog窗口配置时，经常会用到按钮。它有以下几个配置项：
### click
* __类型__: `Function`
* __详细__: 

	按钮点击时触发的函数。在以下几个场景，它有明确的参数的scope（`this`指向变量）：
	1. 在toolbar中使用：
		* 参数：
			* btnConfig，此按钮的配置
			* event，当前点击事件
		* scope: 当前STable对象
	2. 在表格行中使用：
		* 参数
			* record，当前行的原始数据
			* btnConfig，此按钮的配置信息
			* event，当前点击事件
		* scope: 当前STable对象
	3. 在dialog的buttons中使用：
		* 参数
			* btnConfig，此按钮的配置
			* event，当前点击事件
		* scope: 当前Dialog实例对象
* __参考__:
	* <DemoViewer demo="btn-click" />

### cls
* __类型__：`String`
* __详细__：

	按钮上附加的样式class，用于自定义按钮样式。
	```javascript
	buttons: [
		{
			cls: 'app-btn'
		}
	]
	```
* __参考__:
	* <DemoViewer demo="btn-cls" />

### disabled
* __类型__: `Boolean`
* __默认值__: false
* __详细__:

	按钮是否可用。当diabled为true时，按钮显示成灰色，并且点击无效。
* __参考__:
	* <DemoViewer demo="btn-disabled" />

### icon
* __类型__：`String`
* __详细__：

	在不同的容器页面，可能已经加载了不同的字体样式。比如：bootstrap 3.x、elementui、font-awsome，它们都可以用做图标
	```javascript
	buttons: [
		{
			//bootstrap 3.x
			icon: 'glyphicon glyphicon-plus',
			//elementui
			icon: 'el-icon-plus',
			//font-awsome
			icon: 'fa fa-plus'
		}
	]
	```
	当然STable自身也带了几个图标，使用方式
	```
	icon: "st-icon st-icon-[icon type]"
	```
	比如，删除的icon就是 `st-icon st-icon-delete`。icon列表见下图
  ![stble图标](/STable/img/icon.gif)
* __参考__:
	* [bootstrap的icon](https://getbootstrap.com/docs/3.4/components/#glyphicons)
	* [elementui的icon](https://element.eleme.io/#/zh-CN/component/icon)
	* [fontawsome的icon](https://fontawesome.com/v4.7.0/cheatsheet/)
	* <DemoViewer demo="btn-icon" />

### size
* __类型__: `String`
* __默认值__: 'medium'
* __详情__:

	按钮的尺寸，可选值有：
	* large，大尺寸
	* medium，中等尺寸
	* small，小尺寸
* __参考__:
	* <DemoViewer demo="btn-size" />

### style
* __类型__：`Object`
* __详细__：

	按钮上附加的style样式，用于自定按钮样式。
* __参考__:
	* <DemoViewer demo="btn-style" />

### text
* __类型__：`String`
* __详细__：

	按钮上显示的文本。

### type
* __类型__：`String`
* __默认值__：'default'
* __详细__：

	对应bootstrap中对按钮类型的设定，它有 default / primary / success / warning / danger / info / link	。不同类型对应按钮的颜色不一样。
* __参考__:
	* <DemoViewer demo="btn-type" />

### visible
* __类型__：`Boolean`
* __默认值__：true
* __详细__：

	是否显示此按钮。注意，隐藏状态下，button的dom还是存在的。
* __参考__:
	* <DemoViewer demo="btn-visible" />


## Dialog
弹框组件。用STable.createDialog可生成一个dialog实例，比如
```javascript
STable.createDialog({
	title: '测试窗口',
	html: `
		<div>
			<h1>这里是标题</h1>
			<p>一些内容</p>
		</div>
	`,
	buttons: [
		{
			text: '关闭',
			click(){
				this.close();
			}
		}
	]
});
```
Dialog的配置参数有：
### autoShow
* __类型__：`Boolean`
* __默认值__：true
* __详细__：

	窗口创建好之后，是不是立即显示出来。如果为false，就需要程序在合适时机调用show方法显示出来
* __参考__:
	* <DemoViewer demo="dialog-autoShow" />

### bodyCls
* __类型__：`String`
* __详细__：

	应用在窗口元素的样式名，比如`app-dialog app-dialog-new`
* __参考__：
	* <DemoViewer demo="dialog-bodyCls" />

### bodyStyle
* __类型__：`Object`
* __详细__：

	应用在窗口元素上的样式
* __参考__：
	* <DemoViewer demo="dialog-bodyStyle" />

### buttons
* __类型__：`Array`
* __详细__：

	buttons中的每一项是一个按钮的配置
* __参考__：
	* [button api](#button)
	* <DemoViewer demo="dialog-buttons" />

### closable
* __类型__：Boolean
* __默认值__：true
* __详细__：

	是否在标题区域显示一个关闭按钮。注意，这个参数并不是限制窗口关闭不了，只是不显示右上角的关闭按钮。
* __参考__:
	* <DemoViewer demo="dialog-closable" />

### closeAction
* __类型__：`String`
* __默认值__：'destroy'
* __详细__：
	
	关闭窗口时执行的动作。
	* 'destroy'，关闭窗口后直接销毁它
	* 'hide'，关闭窗口后元素不销毁，可以再次通过show方法显示出来
* __参考__:
	* <DemoViewer demo="dialog-closeAction" />

### contentEl
* __类型__：`HTMLElement`
* __详细__：

	窗口内的元素。它可以是页面中已存在的dom元素，也可以document.createElement 建在内存中的元素。
* __参考__:
	* [html](#html)
	* <DemoViewer demo="dialog-contentEl" />

### height
* __类型__：`Number|String`
* __默认值__：480
* __详细__：

	窗口的高度。可以是具体的数值，也是可以百分比，如'80%'
* __参考__:
	* <DemoViewer demo="dialog-height-width" />

### html
* __类型__：`String`
* __详细__：
	
	窗口内的html内容。
	::: tip
	contentEl和html都是指定窗口内展示的内容，不过contentEl是dom元素，可以是页面中已存在的，也可以是通过document.creatElement创建的；html是html代码字符串。
	contentEl和html不会同时生效。
	:::
* __参考__:
	* [contentEl](#contentel)
	* <DemoViewer demo="dialog-html" />

### listeners
* __类型__：`Object`
* __详细__：

	窗口支持的事件:
	* ready，窗口dom元素创建之后触发
	* beforeshow，窗口show动作执行前触发
	* show
	* beforehide，窗口隐藏前触发。注意hide命令只隐藏窗口，不销毁它
	* hide
	* beforeclose，窗口关闭动作执行前触发
	* close，窗口关闭后触发
	* beforedestroy
	* destroy，窗口销毁后触发

	在不同条件和动作下，事件发生的时序：
	* dialog初始化完，发生事件：`ready`
	* 通过show()方法让dialog显示，发生事件：`beforeshow`->`show`
	* 通过hide()方法隐藏窗口，发生事件：`beforehide`->`hide`
	* 通过destroy()方法销毁窗口，发生事件：`beforedestroy`->`destroy`
	* closeAction为'hide'时，通过关闭按钮或者close()方法关闭窗口，发生事件：`beforeclose`->`beforehide`->`hide`->`close`
	* closeAction为'destroy'时，通过关闭按钮或者close()方法关闭窗口，发生事件：`beforeclose`->`beforehide`->`hide`->`beforedestroy`->`destroy`->`close`

	::: tip
	`beforeshow`、`beforehide`、`beforeclose`、`beforedestroy`这四个事件的响应函数，如果返回`false`，会阻止对应动作的发生。如果处于某个事件时序，也会阻止以后的事件发生。
	:::
* __参考__:
	* <DemoViewer demo="dialog-listeners" />
	* <DemoViewer demo="dialog-listeners-stop" />

### modal
* __类型__：`Boolean`
* __默认值__：true
* __详细__：

	窗口是不是模态的。模态窗口会显示一个遮罩层，遮罩使页面中除了窗口，其它地方都不可点击
	```javascript
	//显示一个不带遮罩的窗口
	modal: false
	```
* __参考__:
	* <DemoViewer demo="dialog-modal" />

### title
* __类型__：`String`
* __详细__：

	窗口的标题

### width
* __类型__：`Number|String`
* __默认值__：640
* __详细__：

	窗口的宽度。可以是具体的数值，也是可以百分比，如'80%'
* __参考__:
	* <DemoViewer demo="dialog-height-width" />

### Dialog的实例方法
通过Dialog.create方法创建的Dialog实例，有一些方法，控制窗口的行为。
* show()，使窗口显示出来
* hide()，隐藏窗口，但不销毁dom
* destroy()，直接销毁dom
* close()，隐藏窗口，然后根据closeAction决定是否要销毁窗口dom