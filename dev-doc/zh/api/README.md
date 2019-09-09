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
	var columns={%$columns|json%}; //模板下发了列配置
	STable.init({
		//some other config
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
* __参考__: todo

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
	
	不同请求所使用的请求方法，包括列表、添加、修改、删除。

* __用法__:
	``` js
	STable.init({
		//some other config
		actionMethods: {
			read: 'POST'	//把列表请求换成post方式
		}
	});
	```
* __参考__: todo

### addUrl
* __类型__: `String`
* __详细__:

	添加数据时的提交地址。如果有此参数，会在工具栏toolbar自动显示一个“添加”按钮。

* __参考__: todo

### batDeleteUrl
* __类型__: `String`
* __详细__: 

	批量删除数据时的提交地址。如果有此参数，会在工具栏toolbar自动显示一个“批量删除”按钮，点此按钮，会把所有选中行删除。需要配合参数selectMode使用。
* __参考__: 
	* todo
	* [行选择模式 selectMode](#selectMode)

### columns
* __类型__: `Array|Object`
* __详细__: 

	表格的列配置。数据中的每一项对应表格中的一列，通过它配置此列的表头、表格内容以及展示样式。
* __用法__: todo
* __参考__: todo

### deleteUrl
* __类型__: `String`
* __详细__:

	删除数据时的提交地址。如果有此参数，会在每一行的最后添加一列，此列中有一个“删除”按钮，点此按钮，会删除此行。
* __参考__: todo

### componentOrder
* __类型__: `Array`
* __默认值__: [ 'title', 'tip', 'toolbar', 'search', 'table', 'pagination' ]
* __详细__: 

	STable由几个“部件”构成，分别是：标题(title)、提示(tip)、工具栏(toolbar)、搜索区(search)、表格(table)、分页栏(pagination)。通过componentOrder，我们可以对部件的展示顺序自己调整，比如想把工具栏显示在表格下面，就可以这样设置
	```js
	STable.init({
		//some other config
		componentOrder: ['search', 'table', 'toolbar', 'pagination']
	})
	```
* __参考__: todo

### downloadable
* __类型__: `Boolean|String`
* __默认值__: false
* __详细__: 

	控制导出表格按钮的显示。点击“导出当前页”可以下载当前定页的数据；点击“导出所有页”会把所有页的数据都下载下来。可选的值有：
	* true，在工具栏toolbar同时显示“导出当前页”和“导出所有页”两个按钮
	* false，不会显示下载按钮
	* 'single'，只显示“导出当前页”按钮
	* 'all'，只显示“导出所有页”按钮
* __参考__: todo


### downloadAllFromJustOnePage
* __类型__: `Boolean`
* __默认值__: false
* __详细__: 

	全量下载表格时，会分页把所有数据请求下来。不过有时候分页请求数据反而没有一次性把所有数据导出来快。为了解决这个问题，可以使用这个变量。把它设置为true，全量导出时，只发出一页的请求，并且参数 count 值为 "max"，以标识这次请求希望能把符合要求的所有数据一次数请求到。
* __参考__: todo


### downloadTimeout
* __类型__: `Number`
* __默认值__: 30000
* __详细__: 

	超时时间(毫秒)。全量下载所有数据时，会分页面请求数据，可以用此参数指定每个页面请求的超时时间。如果超时，会中断请求，重新发起一个。
* __参考__: todo

### dynamicParallelCount
* __类型__: `Boolean`
* __默认值__: false
* __详细__: 

	全量下载表格时，根据下载速度，动态调整最大并行数
* __参考__: todo


### editConfig
* __类型__: `Array`
* __详细__: 

	添加或者编辑一行数据时，弹窗中表单的详细设置。
* __参考__:
	* todo
	* form配置



### el
* __类型__: `String|HTMLElement`
* __默认值__: "#stableContainer"
* __详细__: 

	STable在页面中的dom容器，它可以是css选择器，也可是一个dom元素。
* __参考__: todo


### groupBy
* __类型__: `Array|String`
* __详细__: 

	根据指定的列进行合并分组。可以是指定多个列，按顺序，先用第一个列的值进行合并；然后对每个合并后的组，使用第二个列进行再次合并；以此类推。
* __参考__: todo

### idIndex
* __类型__: `String`
* __详细__: 

	crud操作(增删改查)中，修改或者删除行时，由此参数来唯一标识行数据，并发给服务端。
* __参考__: todo

### ignoreEmptySearchParam
* __类型__: `Boolean`
* __默认值__: true
* __详细__: 

	忽略搜索条件中空字符串的项，在请求页数据时，不带上它们
* __参考__: todo

### labelVisible
* __类型__: `Boolean`
* __默认值__: true
* __详细__: 

	搜索区的表单的标签是否显示。当搜索项太多时，把此参数设为false，可以让搜索区显得更为紧凑。
* __参考__: 

### layoutMode
* __类型__: `String`
* __默认值__: "fixed"
* __详细__: 

	stable所在区域的布局，有下面两个值：
	* "fixed"，固定高度模式。STable所在区域高度固定，会根据总体高度、工具栏、搜索区和分页区，决定表格区的高度
	* "expand"，自动伸展模式。STable高度不固定，根据表格区行数不同，自动调整STable的高度。
* __参考__: 

### locale
* __类型__: `String|Object`
* __详细__: 

	STable使用的语言配置。
* __参考__: todo

### sublistAt
* __类型__: `Array|String`
* __详细__: 

	指定列的数据为数组，并且数据中的每一项，在此列以一行展示。
* __用法__: 
	```JS
	STable.init({
		//sublistAt: ['movieType','movieName']
		sublistAt: 'movieType'
	});
	```
* __参考__: 

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
	* [事件](##listeners)

### page
* __类型__: `Number`
* __默认值__: 1
* __详细__: 
  
	初始加载的页号。
* __用法__: 
	```JS
	STable.init({
		//some other config
		//注意 页号从1开始
		page: 1,
	});
	```

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
	

### pageIndex
* __类型__: `String` 
* __默认值__: "id"
* __详细__: 

	如果分页模式是瀑布模式(waterfall)，需要指定由哪个数据字段决定分页，默认是id
* __用法__: 
  ```JS
	STable.init({
		//some other config
		//pageIndex要求唯一性。
		pageIndex: 'id',
	});

### parallelCount
* __类型__: `Number` 
* __默认值__: 6
* __详细__: 

	全量下载表格时，并行请求数
* __用法__: 
  ```JS
	STable.init({
		//some other config
		parallelCount: 6,
	});

### params
* __类型__: `Object`
* __默认值__:
	```json
	params: {
		count: 20
	}
	```
* __详细__: 

	从服务端拉取每页数据时，params中的值也会当做参数一起发送过去。使用这个字段，可以让开发者自定义一些参数，发给列表接口。比如，可以设置
	```json
	params: {
		//让每页请求100条数据，而不是默认的20条。
		count: 100
	}
	```

### records
* __类型__: `Array` 
* __详细__: 

	静态化数据，设置了它后，就不会动态加载页面数据了。直接展示它定义的表格数据
* __用法__: 
  ```json
	//静态数据
	records: [],
	```

### rowNumberVisible
* __类型__: `Boolean`
* __默认值__: false
* __详细__: 

	是否在行首显示行号。
* __用法__: 
  ```JS
	STable.init({
		//some other config
		rowNumberVisible: true,
	});

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
			//some other config
		],
	});
* __参考__:
  
	* [form表单配置](#form配置)

### searchResetable
* __类型__: `Boolean`
* __默认值__: false
* __详细__: 

	在搜索区是否显示“重置”按钮
* __用法__: 
  ```JS
	STable.init({
		//some other config
		searchResetable: false,
	});

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
		//some other config
		//默认none。单选single，多选multiple
		selectMode: 'none',
	}); 

### sortKey
* __类型__: `String`
* __详细__: 

	默认按哪个列排序，它决定请求页数据时，sort_key字段的值。
* __用法__: 
  ```JS
	STable.init({
		//some other config
		//按哪个字段值排序
		selectMode: 'id',
	}); 

### sortDirection
* __类型__: `String`
* __默认值__:  "asc"
* __详细__: 

	同sortKey，sortDirection决定了默认排序方向
* __用法__: 
  ```JS
	STable.init({
		//some other config
		//默认排序asc升序，可选值desc降序
		sortDirection: 'asc',
	});

### titleVisible
* __类型__: `Boolean`
* __默认值__: false
* __详细__: 

	是否显示标题栏。
* __用法__: 
  ```JS
	STable.init({
		//some other config
		//默认false，可选值true
		titleVisible: false,
	});

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
* __用法__: 
	```JS
	STable.init({
		//some other config
		listeners: {
			ready(){
				console.log('窗口初始化完毕');
			}
		}
	});
	```

### refresh
* __Parameters__:
	* records，`Array`，刷新后页面的数据 
* __详细__:

	加载完新一页数据后触发。可以对原始数据做一些处理。
* __用法__: 
	```JS
	STable.init({
		//some other config
		listeners: {
			refresh(records){
				console.log(`当前页共有${records.length}行`);
			}
		}
	});
	```

### beforeadd
* __Parameters__:
	* data，`Object`，要添加的数据
* __详细__:

	添加数据前触发。可以在此对要添加的数据在请求发送前做一些处理
	::: tip
	如果beforeadd的触发函数返回了false，就会中断本次添加动作。这个特性可以用来做数据提交前的检查，一旦发现有问题，可以用它中断添加动作。
	:::
* __用法__: 
	todo，请梳理代码后重写说明和demo
	```JS
	STable.init({
		//some other config
		listeners: {
			beforeadd(data){
				let name = data.name;
				if(!name || name.length<10){
					alert('名字不能为空，且大于10个字符');
					return false;
				} else if(data.needFormat){
					//
				}
			}
		}
	})
	```

### add
* __Parameters__:
	* data，`Object`，要添加的数据
* __详细__:

	添加数据时触发。可以在此对要添加的数据在请求发送前做一些处理
	::: tip
	如果beforeadd的触发函数返回了false，就会中断本次添加动作。这个特性可以用来做数据提交前的检查，一旦发现有问题，可以用它中断添加动作。
	:::
* __用法__: 
	```JS
	STable.init({
		//some other config
		listeners: {
			add(data){
				let name = data.name;
				if(!name || name.length<10){
					alert('名字不能为空，且大于10个字符');
					return false;
				}
			}
		}
	})
	```
### beforeedit
* __Parameters__:
	* data，`Object`，要编辑的数据
* __详细__:

	修改一行数据前触发。可以在此对要编辑的数据在请求发送前做一些处理
* __用法__: 
	::: warning
	如果beforeedit的触发函数返回了false，就会中断本次修改动作
	:::
	```JS
	STable.init({
		//some other config
		listeners: {
			beforeedit(data){
				let name = data.name;
				if(!name || name.length<10){
					alert('名字不能为空，且大于10个字符');
					return false;
				}
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

#### __介绍__ :加载完新一页数据后触发，用在listeners中，用于对原始数据做处理。
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

#### __介绍__ :table数据发生变化影响布局时调用。
```js
dataChange(): {
	//数据发生变化逻辑
	//调用方式
	this.layout();
}
```

### getSelectRows

#### __介绍__ :获取table表格中选中的行，返回值为数组。
```js
getSelectRows(): {
	//对数组进行操作[records]
}
```
### getSearchParam

#### __介绍__ :获得当前搜索表单内容，返回值为formData对象，可使用append()方法添加字段（类型可以是 Blob, File）。
```js
handleSubmit(target): {
	let formData = getSearchParam(target);
	target.append('name','豆豆')
	console.log(target);
}
```

### setRecords

#### __介绍__ :设置表格数据，无需手动刷新。
```js
let dataList;
//dataList = res.data.list
this.setRecords(dataList);
```
## column配置
#### __类型__: `Array|Object`
* __详细__: 

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

## form配置
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

## button配置

可在toolbar、column、form表单配置时使用。有以下几个配置项：

### click
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

### cls
* 类型：String
* 详细：
按钮上附加的样式class，用于自定义按钮样式。

### icon
* 类型：string
* 详细
对应font-awsome中的字体图标，比如icon:'plus'，就是在此按钮上显示一个glyphicon-plus图片，即一个加号图标。
* 参考：
	* [font awsome的图标](https://doc.wfxteam.com/html/fa.html)

### style
* 类型：Object
* 详细：
按钮上附加的style样式，用于自定按钮样式。

### text
* 类型：string
* 详细：
按钮上显示的文本。

### type
* 类型：string
* 默认值：'default'
* 详细：
对应bootstrap中对按钮类型的设定，它有 default / primary / success / warning / danger / info / text	。不同类型对应按钮的颜色不一样。

### visible
* 类型：Boolean|<String,String>|Function
* 默认值：true
* 详细：
是否显示此按钮。仅对行中显示button有效。
	* 当visible为数组时，数组第一项为dataIndex，第二项为对比值，当某行中，dataIndex对应的数据和对比值一样时，才会显示此按钮。
	* 当visible为函数时，函数的返回值为true时，显示此按钮；否则不显示

## dialog配置

* 弹框组件。用Dialog.create方式可生成一个完成的dialog实例，也可以使用快捷的功能函数alert\confirm\prompt。

### Dialog.qtip(msg[, type[, config]])
在页面顶部显示一个快速的tip，类似于toast。
![qtip](img/qtip.png)
qtip有多态形式
```js
Dialog.qtip(msg[, type[, config]]);
Dialog.qtip(msg[, config]);
Dialog.qtip(config);
```
[查看demo](/html/demo?demo=dialog)

_参数_：
* msg
	* 类型：`String`
	* 详情：消息文字
* type
	* 类型：String
	* 详情：颜色类型，可选值有 success/warning/info/error
* config
	* 类型：Object
	* 详情：config下所有可配置的参数：
		* message，String，会重写msg参数
		* type, String，会重写type参数
		* duration，Number，显示时间，毫秒。默认为3000。

### Dialog.alert(msg[, title[, config]])
显示一个带消息的警告框。

使用方法：
```javascript
Dialog.alert('这是一个提示');
Dialog.alert('这是一个提示', '提示');
Dialog.alert('这是一个提示', {
	fn(){
		alert('这里是关闭提示时，做的一些动作');
	}
});
Dialog.alert('这是一个提示', '提示', {
	fn(){
		alert('这里是关闭提示时，做的一些动作');
	}
});
```
_参数_：
* msg
	* 类型：String
	* 详情：消息文本
* title
	* 类型：String
	* 详情：对话框的标题
* config
	* 类型：Object
	*  详情：config下所有可配置的参数：
		* message，String，会重写msg参数
		* title, String，会重写type参数
		* fn，Function，关闭对话框时触发的函数

### Dialog.confirm(msg[, title[, config]])
显示一个带有指定消息和 OK 及取消按钮的对话框。

使用方法：
```js
Dialog.confirm('这是一个提示');
Dialog.confirm('这是一个提示', '提示');
Dialog.confirm('这是一个提示', {
	fn(ret){
		if(ret=='yes')
			alert('您选择了确定按钮');
		else
			alert('您选择了关闭或者取消按钮')
	}
});
```

_参数_：
* msg
	* 类型：String
	* 详情：消息文本
* title
	* 类型：String
	* 详情：对话框的标题
* config
	* 类型：Object
	*  详情：config下所有可配置的参数：
		* message，String，会重写msg参数
		* title, String，会重写type参数
		* fn，Function，关闭对话框或者点击按钮时触发的函数，参数有：
			* ret，String，为'yes'时表明点击了“确定”按钮；为“no”时表明点击了“取消”或“关闭”按钮

### Dialog.prompt(msg[, title[, config]])
显示可提示用户进行输入的对话框。

使用方法：
```js
Dialog.confirm('需要您输入内容', {
	fn(ret){
		alert('您输入的内容是：'+ret);
	}
});
```

_参数_：
* msg
	* 类型：String
	* 详情：消息文本
* title
	* 类型：String
	* 详情：对话框的标题
* config
	* 类型：Object
	*  详情：config下所有可配置的参数：
		* message，String，会重写msg参数
		* title, String，会重写type参数
		* fn，Function，关闭对话框或者点击按钮时触发的函数，参数有：
			* ret，String，用户输入的内容

### Dialog.create(config)
标准的窗口组件，通过config参数来配置不同的窗口。config的参数有：
`注意，上面的qtip和对话框都不是真正的窗口组件，只是挂在Dialog下的快捷使用入口`

* title
	* 类型：String
	* 默认值：''
	* 详细：窗口的标题
* bodyCls
	* 类型：String
	* 默认值：null
	* 详细：应用在窗口元素的样式名
* bodyStyle
	* 类型：Object
	* 详细：应用在窗口元素上的样式
* contentEl
	* 类型：dom元素
	* 详细：窗口内的元素
* html
	* 类型：String
	* 详细：窗口内的元素。注意，contentEl和html都是指定窗口内展示的内容，不过contentEl是dom元素，可以是页面中已存在的，也可以是通过document.creatElement创建的；html是html代码字符串
* width
	* 类型：Number/String
	* 默认值：640
	* 详细：窗口的宽度。可以是具体的数值，也是可以百分比，如'80%'
* height
	* 类型：Number/String
	* 默认值：480
	* 详细：窗口的高度。可以是具体的数值，也是可以百分比，如'80%'
* autoShow
	* 类型：Boolean
	* 默认值：true
	* 详细：窗口创建好之后，是不是立即显示出来。如果为false，就需要程序在合适时机调用show方法显示出来
* closable
	* 类型：Boolean
	* 默认值：true
	* 详细：在标题区域显示一个关闭按钮。注意，这个参数并不是限制窗口关闭不了，只是不显示右上角的关闭按钮
* modal
	* 类型：Boolean
	* 默认值：true
	* 详细：窗口是不是模态的。模态窗口会显示一个遮罩层，遮罩使页面中除了窗口，其它地方都不可点击
* closeAction
	* 类型：String
	* 默认值：'destroy'
	* 详细：关闭窗口时执行的动作。
		* 'destroy'，关闭窗口后直接销毁它
		* 'close'，关闭窗口后元素不销毁，可以再次通过show方法显示出来
* listeners
	* 类型：Object
	* 详细：窗口支持的事件
		* ready，窗口dom元素创建之后触发
		* beforeshow，窗口show动作执行前触发
		* beforehide，窗口隐藏前触发。注意hide命令只隐藏窗口，不销毁它
		* beforeclose，窗口关闭动作执行前触发
		* close，窗口关闭后触发
		* destroy，窗口销毁后触发
* buttons
	* 类型：Array
	* 详细：buttons中的每一项是一个按钮的配置
	* 参考：
		* [按钮配置](##button配置)

### Dialog的实例方法
通过Dialog.create方法创建的Dialog实例，有一些方法，控制窗口的行为。
* show()，使窗口显示出来
* hide()，隐藏窗口，并且不销毁dom
* close()，隐藏窗口，然后根据closeAction决定是否要销毁窗口dom