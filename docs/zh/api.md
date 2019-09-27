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
	
	STable.init({
		//...some other config
		columns,
		acc: {	//额外增加一些列设置
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
	});
	```
* __参考__:
	* <DemoViewer demo="acc" />

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
	STable.init({
		//...some other config
		actionMethods: {
			read: 'POST'	//把列表请求换成post方式
		}
	});
	```
* __参考__:
	* [demo](https://codepen.io/liupengke/pen/pozaKOR?editors=1010)

### addConfig
* __类型__: `String`
* __详细__:

	添加数据时，弹窗内的form表单配置。它需要和addUrl配合使用。
	:::tip
	如果配置addConfig，STable会尝试使用updateConfig替代它。
	:::

* __参考__:
	* [demo](https://codepen.io/liupengke/pen/VwZQdqR)
	* [addUrl](#addurl)
	* [form配置](#form)

### addUrl
* __类型__: `String`
* __详细__:

	添加数据时的提交地址。如果有此参数，会在工具栏toolbar自动显示一个“添加”按钮，点击此按钮出现“添加”面板。它需要和addConfig配合使用。

* __参考__:
	* [demo](https://codepen.io/liupengke/pen/VwZQdqR)
	* [addConfig](#addconfig)

### batDeleteUrl
* __类型__: `String`
* __详细__: 

	批量删除数据时的提交地址。如果有此参数，会在工具栏toolbar自动显示一个“批量删除”按钮，点此按钮，会把所有选中行删除。需要配合参数selectMode和idIndex使用。
* __参考__: 
	* [demo](https://codepen.io/liupengke/pen/xxKWLpZ?editors=1010#0)
	* [idIndex](./#idindex)
	* [行选择模式 selectMode](./#selectmode)

### columns
* __类型__: `Array`
* __详细__: 

	表格的列配置。数据中的每一项对应表格中的一列，通过它配置此列的表头、表格内容以及展示样式。
* __用法__: 
	如果只是简单的显示列的内容，可以直接写列对应的数据名：
	```javascript
	STable.init({
		//...other configs
		columns: ['name', 'age', 'gender']
	});
	```
	对于有特殊要求的列，比如宽度、是否锁定，甚至要自己决定渲染内容的，可以用对象配置
	```javascript
	STable.init({
		//...other configs
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
	});
	```

	更多、更详细的列配置参数，请看 [column config](#columnconfig)
* __参考__:
	* [column config](#columnconfig)
	* [demo](https://codepen.io/liupengke/pen/Rwbyede)

### componentOrder
* __类型__: `Array`
* __默认值__: [ 'title', 'tip', 'toolbar', 'search', 'table', 'pagination' ]
* __详细__: 

	STable由几个“部件”构成，分别是：标题(title)、提示(tip)、工具栏(toolbar)、搜索区(search)、表格(table)、分页栏(pagination)。通过componentOrder，我们可以对部件的展示顺序自己调整，比如想把工具栏显示在表格下面，就可以这样设置
	```js
	STable.init({
		//...other configs
		componentOrder: ['search', 'table', 'toolbar', 'pagination']
	})
	```
* __参考__:
	* [demo](https://codepen.io/liupengke/pen/xxKjQZY)

### deleteUrl
* __类型__: `String`
* __详细__:

	删除数据时的提交地址。如果有此参数，会在每一行的最后添加一列，此列中有一个“删除”按钮，点此按钮，会删除此行。需要和参数`idIndex`配合使用。
* __参考__: 
	* [demo](https://codepen.io/liupengke/pen/WNeJLWg)
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
	* [demo](https://codepen.io/liupengke/pen/VwZxgOd)

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
	* [demo](https://codepen.io/liupengke/pen/VwZdZzM)

### el
* __类型__: `String|HTMLElement`
* __默认值__: "#stableContainer"
* __详细__: 

	STable在页面中的容器，它可以是css选择器，也可是一个dom元素。
* __参考__:
	[demo](https://codepen.io/liupengke/pen/vYBaMoL)

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
	* [demo](https://codepen.io/stablejs/pen/eYOPNLX?editors=1010#0)

### labelVisible
* __类型__: `Boolean`
* __默认值__: true
* __详细__: 

	搜索区的表单的标签是否显示。当搜索项太多时，把此参数设为false，可以让搜索区显得更为紧凑。
* __参考__: 
	* [demo](https://codepen.io/stablejs/pen/PoYyqvO?editors=1010#0)

### layoutMode
* __类型__: `String`
* __默认值__: "fixed"
* __详细__: 

	stable所在区域的布局，有下面两个值：
	* "fixed"，固定高度模式。STable所在区域高度固定，会根据总体高度、工具栏、搜索区和分页区，决定表格区的高度
	* "expand"，自动伸展模式。STable高度不固定，根据表格区行数不同，自动调整STable的高度。
* __参考__: 
	* [demo: 指定绝对高度](https://codepen.io/stablejs/pen/PoYyPoE?editors=1010#0)
	* [demo: 通过flex设置高度](https://codepen.io/stablejs/pen/MWgPaWd)
	* [demo: 高度不限制](https://codepen.io/stablejs/pen/jONeWWb?editors=1010#0)

### listeners
* __类型__: `Object`
* __详细__: 

	STable在不时机触发一些钩子函数，开发者可以在这些时机做一些自己的功能。
* __用法__: 
	```JS
	STable.init({
		//some other config
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
	});
	```
* __参考__: 
	* [事件](#listeners)

### locale
* __类型__: `String|Object`
* __详细__: 

	STable使用的语言配置。
* __参考__: 
	* [demo](https://codepen.io/stablejs/pen/rNBqxzG?editors=1010#0)
	* [local词典明细](https://github.com/inagora/STable/tree/master/src/lang)

### page
* __类型__: `Number`
* __默认值__: 1
* __详细__: 
  
	初始加载的页号。注意：计数从1开始。
* __用法__: 
	```JS
	STable.init({
		//some other config
		//注意 页号从1开始
		page: 1,
	});
	```
* __参考__:
	* [demo](https://codepen.io/stablejs/pen/oNvaBXz)

### pageMode
* __类型__: `String`
* __默认值__: "normal"
* __详细__: 

	分页模式。目前支持两种：
	* normal：模认的分页模式，需要通过页号和每页的行数，决定每一页的数据内容。
	* waterfall：瀑布流模式，需要根据当前页的第一行的pageIndex向前找上一页或者最后一行数据的pageIndex向后找一页的数据。
* __用法__: 
  ```JS
	STable.init({
		//some other config
		//pageMode: ‘waterfall’
		pageMode: 'normal',
	});
* __参考__:
	* [demo - 瀑布流模式](https://codepen.io/stablejs/pen/BaBqpjx?editors=1010#0)
	* [pageIndex](#pageindex)

### pageIndex
* __类型__: `String` 
* __默认值__: "id"
* __详细__: 

	如果分页模式是瀑布模式(waterfall)，需要指定由哪个数据字段决定分页
* __用法__: 
  ```JS
	STable.init({
		//...other configs
		pageIndex: 'goods_id',
	});
* __参考__:
	* [pageMode](#pagemode)

### parallelCount
* __类型__: `Number` 
* __默认值__: 6
* __详细__: 

	全量下载表格时，并行请求数。因为当前浏览器一个域名的并行请求数一般为6个，所以设置的值超过6，并没有太大的意义。
	:::tip
	一般并行数越高，下载速度越快。但是，并行数越高，对服务器处理并发的能力越强；如果服务器并发能力不够，可能会导致请求一直不返回，甚至超时；超时后会重新发起这个页面的数据请求，请求可能又会超时，如此往复，可能会引起雪崩。如果某个接口的服务承载能力不强，建议把这个值设置的小一些。
	:::
* __用法__: 
  ```JS
	STable.init({
		//...other configs
		parallelCount: 4
	});
* __参考__:
	* [demo](https://codepen.io/stablejs/pen/OJLBdVM?editors=1010#0)
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
	STable.init({
		//...other configs
		params: {
			count: 100,
			color: 'red'
		}
	});
	```
* __参考__:
	* [demo](https://codepen.io/stablejs/pen/ZEzmXao?editors=1010#0)

### records
* __类型__: `Array` 
* __详细__: 

	静态化数据，设置了它后，就不会动态加载页面数据了。直接渲染它定义的表格数据
* __用法__: 
  ```javascript
	STable.init({
		//...other configs
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
	});
	```
* __参考__
	* [demo](https://codepen.io/stablejs/pen/pozQWap?editors=1010#0)

### rowNumberVisible
* __类型__: `Boolean`
* __默认值__: false
* __详细__: 

	是否在行首显示行号。注意，只是当前页的行号，并不是所有页的总体序号。
* __用法__: 
  ```JS
	STable.init({
		//...other configs
		rowNumberVisible: true,
	});
* __参考__:
	* [demo](https://codepen.io/stablejs/pen/WNeYZzO?editors=1010#0)

### searchFilter
* __类型__: `array|Object`
* __详细__: 

	搜索区域的配置。因为搜索区域本质上是一个form表单，搜索配置其实是表单项的配置。
* __用法__: 
  ```JS
	STable.init({
		searchFilter: [
			{
				label: '名字',
				name: 'name'
			}
		]
		//...other configs
	});
* __参考__:
	* [form表单配置](#form)
	* [demo](https://codepen.io/stablejs/pen/QWLJqrq?editors=1010#0)

### searchResetable
* __类型__: `Boolean`
* __默认值__: false
* __详细__: 

	在搜索区是否显示“重置”按钮，点击后重置表单项为默认值
* __用法__: 
  ```JS
	STable.init({
		//...other configs
		searchResetable: false,
	});
* __参考__
	* [demo](https://codepen.io/stablejs/pen/PoYxJBG?editors=1010#0)

### selectMode
* __类型__: `String`
* __默认值__: "none"
* __详细__: 

	行的选择模式。在单选框或复选框选择行之后，可以通过STable的getSelectedRows接口获取所有选中的行。有以下三种模式：
	* 'none'，在表格行前面不显示选择按钮
	* 'single'，单选模式，在表格行前显示单选按钮
	* 'multiple'，多选模式，在表格行前显示多选按钮
* __用法__: 
  ```JS
	STable.init({
		//...other configs

		selectMode: 'single'
	});
* __参考__:
	* [demo-single](https://codepen.io/stablejs/pen/zYOMEye?editors=1010#0)
	* [demo-multiple](https://codepen.io/stablejs/pen/WNeYZPX?editors=1010#0)

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
	* [demo](https://codepen.io/stablejs/pen/RwbENqq?editors=1010#0)
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
	```JS
	STable.init({
		//...other configs
		//设置默认排序方向
		sortDirection: 'asc',
	});
* __参考__:
	* [demo](https://codepen.io/stablejs/pen/BaBvyvX?editors=1010#0)

### sublistAt
* __类型__: `Array|String`
* __详细__: 

	把指定列的每个单元格显示为多行。
	:::tip
	指定列的数据需要为一维数组，数组中的每一项在单元格中渲染为一行。
	:::
* __用法__: 
	```JS
	STable.init({
		//...other configs
		//设置子列表
		sublistAt: 'movieType'
	});
	```
* __参考__: 
	* [demo](https://codepen.io/stablejs/pen/RwbENOv)

### toolbar
* __类型__: `Array`
* __详细__: 

	表格的工具栏，它里面是按钮或分割符。
* __用法__: 
  ```js
	Stable.init({
		toolbar: [
			{
				text: '删除',
				icon: 'close',
				type: 'danger',
				click(){
					console.log(this.getSelectedRows())
				}
			}
		]
	})
	```
* __参考__: 
<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="result" data-user="cocopang" data-slug-hash="XWreYEo" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="toolbar">
  <span>See the Pen <a href="https://codepen.io/cocopang/pen/XWreYEo/">
  toolbar</a> by ccpang (<a href="https://codepen.io/cocopang">@cocopang</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### updateConfig
* __类型__: `Array`
* __详细__: 

	编辑一行数据时，弹窗中表单的详细设置。需要和参数`updateUrl`配合使用。
	:::tip
	如果设置了addUrl参数，但未设置addConfig，会使用editConfig做为添加数据的表单
	:::
* __参考__:
	* [demo](https://codepen.io/liupengke/pen/xxKJezM)
	* [form配置](#form)

### updateUrl
* __类型__: `String`
* __详细__: 

	修改行数据时的提交地址。如果有此参数，会在每一行的最后添加一列，此列中有一个“修改”按钮，点此按钮，会显示修改窗口。
* __用法__: 
	```js
	Stable.init({
		updateUrl: '/demo/ajaxUpdate',
	})
	```
* __参考__:
	* [demo](https://codepen.io/liupengke/pen/xxKJezM)
	* [updateConfig](#updateconfig)

### url
* __类型__: `String`
* __详细__: 

	请求每页数据的异步接口。
* __用法__: 
  ```js
	Stable.init({
		url: '/demo/ajaxList',
	})
	```

## 事件
所有事件的监听函数中this都指向当前STable实例。当然，如果你用箭头函数等方式，就另当别论了。

### ready
* __详细__:

	在STable初始化之后触发。适合作一些准备工作，如事件绑定、数据准备，类似于浏览器的domready
	:::warning
	ready事件中，STable的初化工作完成，但数据不一定准备好了。
	:::
* __用法__: 
	```javascript
	STable.init({
		//some other config
		//设置stable初始化完毕后做的事情
		listeners: {
			ready(){
				console.log('窗口初始化完毕');
			}
		}
	});
	```
* __参考__:
	* [demo](https://codepen.io/stablejs/pen/QWLzbwN?editors=1010#0)

### refresh
* __参数__:
	* records，`Array`，刷新后页面的数据 
* __详细__:

	加载完新一页数据后触发。可以真正渲染前，对原始数据做一些处理。
* __用法__: 
	```JS
	STable.init({
		//...other configs
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
	});
	```
* __参考__:
	* [demo](https://codepen.io/stablejs/pen/jONXvQE)

### beforeadd
* __Parameters__:
	* data，`Object`，要添加的数据
* __详细__:

	添加数据前触发。可以在此时，对要添加的数据在请求发送前做一些处理，比如数据校验
	::: tip
	如果beforeadd的触发函数返回了false，就会中断本次添加动作。这个特性可以用来做数据提交前的检查，一旦发现有问题，可以用它中断添加动作。
	:::
* __用法__: 
	```javascript
	STable.init({
		//...other configs

		listeners: {
			beforeadd(data){
				let name = data.name;
				if(!name || name.length<10){
					alert('名字不能为空，且大于10个字符');
					return false;
				}
			}
		}
	})
	```
* __参考__:
	* [demo](https://codepen.io/stablejs/pen/MWgZqLe)

### add
* __Parameters__:
	* response，`Object`，本次请求的返回内容
	* data，`Object`，已添加的数据
* __详细__:

	添加数据后触发。此时可以拿到服务端返回的数据，然后对数据做一些处理
* __用法__: 
	```JS
	STable.init({
		//...other configs

		listeners: {
			add(response, data){
				if(response.errno==0){
					console.log(`adding record successed!`);
				} else {
					console.log('adding record failed!');
				}
			}
		}
	})
	```
* __参考__:
	* [demo](https://codepen.io/stablejs/pen/jONXvJP?editors=1010#0)

### beforeedit
* __Parameters__:
	* data，`Object`，要编辑的数据
* __详细__:

	修改一行数据前触发。可以在此对要编辑的数据在请求发送前做一些处理，比如数据调整或校验。
	::: tip
	如果beforeedit的触发函数返回了false，就会中断本次修改动作
	:::
* __用法__: 
	```JS
	STable.init({
		//...other configs

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
	})
	```

### edit
* __Parameters__:
  * data，`Object`，要编辑的数据
* __详细__:

	修改一行数据时触发。在此对要编辑的数据做处理和发送请求
* __用法__: 
	```JS
	STable.init({
		//some other config
		listeners: {
			edit(data){
				let name = data.name;
				if(!name || name.length<10){
					alert('名字不能为空，且大于10个字符');
					return false;
				}
			}
		}
	})
	```

### search
* __Parameters__:
  * evt，`Object`，搜索的参数
* __详细__:

	可以在搜索时对于参数做处理，在搜索时触发
* __用法__: 
  ::: warning
	注意，如果search的触发函数返回了false，就会中断本次搜索动作
	:::
  ```js
	Stable.init({
		//some other config
		listeners: {
			search(evt) {
				let searchParams;
				searchParams = this.trimParam(evt);
				//发送请求
			},
		}
	})

### beforedatarequest
* __Parameters__:
  * params，`Object`，搜索的参数
* __详细__:
  
	* 发送请求前可用此方法对参数进行组装或校验，发请求前触发
* __用法__: 
  ```js
	Stable.init({
		//some other config
		listeners: {
			beforedatarequest(params) {
				let ajaxOptions = {url:this.url, data: params, type:this.actionMethods.read, timeout: this.downloadTimeout};
				//发送请求
			},
		}
	})

### dataload
* __Parameters__:
	* responseData，`Object`，刚下载的原始数据
* __详细__:
  
	从网络下载一页新数据后触发。此时对数据还没有做任何处理。可以在此对原始数据做一些预处理。
* __用法__: 
  ```js
	Stable.init({
		//some other config
		listeners: {
			dataload(data) {
				let name = data.name;
				if(!name || name.length<10){
					alert('名字不能为空，且大于10个字符');
					return false;
				}
			},
		}
	})

## 实例方法
### refresh
* __详细__:

加载完新一页数据后触发，用在listeners中，用于对原始数据做处理。
```js
listeners: {
	refresh(records){
		//数据刷新之后，可以对数据做一些处理
		let count = records.length;
		console.log(`we get ${count} records`);
	}
}
```
### layout
* __详细__:
table数据发生变化影响布局时调用。
```js
dataChange(): {
	//数据发生变化逻辑
	//调用方式
	this.layout();
}
```

### getSelectRows
* __详细__:
获取table表格中选中的行，返回值为数组。
```js
getSelectRows(): {
	//对数组进行操作[records]
}
```
### getSearchParam
* __详细__:
获得当前搜索表单内容，返回值为formData对象，可使用append()方法添加字段（类型可以是 Blob, File）。
```js
handleSubmit(target): {
	let formData = getSearchParam(target);
	target.append('name','豆豆')
	console.log(target);
}
```

### setRecords
* __详细__:
设置表格数据，无需手动刷新。
```js
let dataList;
//dataList = res.data.list
this.setRecords(dataList);
```

# column
表格的列配置。数据中的每一项对应表格中的一列，通过它配置此列的表头、表格内容以及展示样式。
* __用法__: *表示必填项
	```js
	columns: [
		{
			header: 'id', //* 每列的title
			dataIndex:'id', //* 对应数据的字段名
			width: 100, // 宽度（可不填）
			locked: true, // 是否锁定，默认左侧锁定 可选值：right
			sortable: true, // 是否排序
			render(record){ //对当前行数据处理渲染
				return record.actors.join(' | ');
			},
			buttons: [{ //详细使用方法见buttons
				text: 'fff', //button文字颜色
				click(){  //button操作
					console.log(this);
				},
				icon: 'st-iconfont st-icon-eye', //button添加icon
			}]
		},
	]
	
	```
* __参考__: todo

#### __介绍__ :设置表格数据，无需手动刷新。
```js
let dataList;
//dataList = res.data.list
this.setRecords(dataList);
```

## form
* __介绍__:由输入框（input/textarea）、选择器(select)、单选框(radio)、多选框(checkbox)、开关（switch）、文件上传（file）等控件组成，用以收集、校验、提交数据。可以单独作为组件使用（x-form），也可集成在STable使用，详见demo。
  
### 集成在Stable:

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="result" data-user="cocopang" data-slug-hash="vYBWGZY" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="vYBWGZY">
  <span>See the Pen <a href="https://codepen.io/cocopang/pen/vYBWGZY/">
  vYBWGZY</a> by ccpang (<a href="https://codepen.io/cocopang">@cocopang</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 单独使用form组件:

* __inline__: 
  * `Boolean` 默认false 纵向布局，当垂直方向空间受限且表单较简单时（比如搜索）可以设置为true，表示在一行内放置表单。
	
* __size__: 
	* `String` 默认值'small'，可选项'small'，'middle'，'large'。

* __labelVisible__: 
	* `Boolean` 
	* 默认值true，是否显示form表单的label。

* __fieldList__: 
	* `Object` 表单配置项（json对象）。

* __submit__: 
	* 表单提交发起的请求。

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="result" data-user="cocopang" data-slug-hash="NWKpLrv" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="NWKpLrv">
  <span>See the Pen <a href="https://codepen.io/cocopang/pen/NWKpLrv/">
  NWKpLrv</a> by ccpang (<a href="https://codepen.io/cocopang">@cocopang</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

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

### cls
* __类型__：`String`
* __详细__：

	按钮上附加的样式class，用于自定义按钮样式。

### disabled
* __类型__: `Boolean`
* __默认值__: false
* __详细__:

	按钮是否可用。当diabled为true时，按钮显示成灰色，并且点击无效。

### icon
* __类型__：`String`
* __详细__：

	在不同的容器页面，可能已经加载了不同的字体样式。比如：bootstrap 3.x、elementui、font-awsome，它们都可以用做图标
	```javascript
	buttons: [
		{
			text: '添加资料',
			//bootstrap 3.x
			icon: 'glyphicon glyphicon-plus',
			//elementui
			icon: 'el-icon-plus',
			//font-awsome
			icon: 'fa fa-plus'
			click(){
				//do something
			}
		}
	]
	```
	当然STable自身也带了几个图标，使用方式
	```
	icon: "st-iconfont st-icon-[icon type]"
	```
	比如，删除的icon就是 `st-iconfont st-icon-delete`。icon列表见下图
  ![stble图标](/img/icon.gif)
* __参考__:
	* [bootstrap的icon](https://getbootstrap.com/docs/3.4/components/#glyphicons)
	* [elementui的icon](https://element.eleme.io/#/zh-CN/component/icon)
	* [fontawsome的icon](https://fontawesome.com/v4.7.0/cheatsheet/)

### size
* __类型__: `String`
* __默认值__: 'medium'
* __详情__:

	按钮的尺寸，可选值有：
	* large，大尺寸
	* medium，中等尺寸
	* small，小尺寸
* __参考__:
	* [demo](https://codepen.io/stablejs/pen/GRKzvLY?editors=1010#0)

### style
* __类型__：`Object`
* __详细__：

	按钮上附加的style样式，用于自定按钮样式。

### text
* __类型__：`String`
* __详细__：

	按钮上显示的文本。

### type
* __类型__：`String`
* __默认值__：'default'
* __详细__：

	对应bootstrap中对按钮类型的设定，它有 default / primary / success / warning / danger / info / text	。不同类型对应按钮的颜色不一样。
* __参考__:
	* [demo](https://codepen.io/stablejs/pen/BaBMdvM?editors=1010#0)

### visible
* __类型__：`Boolean`
* __默认值__：true
* __详细__：

	是否显示此按钮。注意，隐藏状态下，button的dom还是存在的。


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
	* [demo](https://codepen.io/stablejs/pen/bGbzKPe?editors=1010#0)

### bodyCls
* __类型__：`String`
* __详细__：

	应用在窗口元素的样式名，比如`app-dialog app-dialog-new`
* __参考__：
	* [demo](https://codepen.io/stablejs/pen/OJLdwzp?editors=1010#0)

### bodyStyle
* __类型__：`Object`
* __详细__：

	应用在窗口元素上的样式
* __参考__:
	* [demo](https://codepen.io/stablejs/pen/MWgLBVB?editors=0010#0)

### buttons
* __类型__：`Array`
* __详细__：

	buttons中的每一项是一个按钮的配置
* __参考__：
	* [按钮配置](#button)
	* [demo](https://codepen.io/stablejs/pen/eYOxjKQ?editors=0010#0)

### closable
* __类型__：Boolean
* __默认值__：true
* __详细__：

	是否在标题区域显示一个关闭按钮。注意，这个参数并不是限制窗口关闭不了，只是不显示右上角的关闭按钮。
* __参考__:
	* [demo](https://codepen.io/stablejs/pen/JjPxBwj?editors=0010#0)

### closeAction
* __类型__：`String`
* __默认值__：'destroy'
* __详细__：
	
	关闭窗口时执行的动作。
	* 'destroy'，关闭窗口后直接销毁它
	* 'hide'，关闭窗口后元素不销毁，可以再次通过show方法显示出来
* __参考__:
	* [demo](https://codepen.io/stablejs/pen/QWLYBYr?editors=1010)

### contentEl
* __类型__：`HTMLElement`
* __详细__：

	窗口内的元素。它可以是页面中已存在的dom元素，也可以document.createElement但也建在内存中的元素。
* __参考__:
	* [html](#html)
	* [demo]()

### height
* __类型__：`Number|String`
* __默认值__：480
* __详细__：

	窗口的高度。可以是具体的数值，也是可以百分比，如'80%'

### html
* __类型__：`String`
* __详细__：
	
	窗口内的元素。
	::: tip
	contentEl和html都是指定窗口内展示的内容，不过contentEl是dom元素，可以是页面中已存在的，也可以是通过document.creatElement创建的；html是html代码字符串。
	contentEl和html不会同时生效。
	:::
* __参考__:
	* [demo]()

### listeners
* __类型__：`Object`
* __详细__：

	窗口支持的事件
	* ready，窗口dom元素创建之后触发
	* beforeshow，窗口show动作执行前触发
	* beforehide，窗口隐藏前触发。注意hide命令只隐藏窗口，不销毁它
	* beforeclose，窗口关闭动作执行前触发
	* close，窗口关闭后触发
	* destroy，窗口销毁后触发

### modal
* __类型__：`Boolean`
* __默认值__：true
* __详细__：

	窗口是不是模态的。模态窗口会显示一个遮罩层，遮罩使页面中除了窗口，其它地方都不可点击

### title
* __类型__：`String`
* __详细__：

	窗口的标题

### width
* __类型__：`Number|String`
* __默认值__：640
* __详细__：

	窗口的宽度。可以是具体的数值，也是可以百分比，如'80%'

### Dialog的实例方法
通过Dialog.create方法创建的Dialog实例，有一些方法，控制窗口的行为。
* show()，使窗口显示出来
* hide()，隐藏窗口，并且不销毁dom
* close()，隐藏窗口，然后根据closeAction决定是否要销毁窗口dom