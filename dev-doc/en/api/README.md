# API

## config
::: tip
For some outdated parameters, We will mark it with<sup style="color:red">dep</sup>.Try not to use these parameters, please use alternatives as recommended.
:::
### acc
* __type__: `Object`
* __details__:

	Is the abbreviation of the additionalColumnConfig. Sometimes the column configuration is sent from the server, But with this parameter you can add some extra configuration using javascript. It is an `Object` , each key value corresponds to a column's dataIndex, and value is the configuration added to this column.
* __usage__:
	```js
	var columns={%$columns|json%}; //Column configuration delivered by the template file
	STable.init({
		//some other config
		columns,
		acc: {	//Additional column config
			actorName: {
				width: 200	// Set the width of the actorName column to 200
			},
			avatar: {
				//Avatar column adds render function in order to display a picture
				render(record){
					return `<a href="/avatar/big/${record.id}" target="_blank"><img src="${record.avatar}"></a>`;
				}
			}
		}
	});
	```

### actionMethods
* __type__: `Object`
* __defaults__:
```
{
	create: 'POST',
	read: 'GET',
	update: 'POST',
	delete: 'POST'
}
```
* __details__:
	
	Request methods used by different requests, including list, add, modify, delete.

* __usage__:
	``` js
	STable.init({
		//some other config
		actionMethods: {
			read: 'POST'	// Change the request method to ‘POST’
		}
	});
	```
* __example__: todo

### addUrl
* __type__: `String`
* __details__:

 The submission URL when adding data. If you have this parameter, an "Add" button will be automatically displayed in the toolbar.

* __example__: todo

### batDeleteUrl
* __type__: `String`
* __details__: 

	The submission URL when deleting data in bulk. If this parameter is present, a "bulk delete" button will be automatically displayed in the toolbar of the toolbar, And clicking this button will delete all selected lines. Need to use with the parameter [selectMode](#selectMode).
* __example__: 
	* todo
	* [行选择模式 selectMode](#selectMode)

### columns
* __type__: `Array|Object`
* __details__: 

	The column configuration of the STable. Each item in the data corresponds to a column in the table, which configures the header, table contents, and display style of this column.
* __usage__: todo
* __example__: todo

### deleteUrl
* __type__: `String`
* __details__:

	The submission URL when deleting data. If this parameter is present, a column will be added at the end of each line. There is a "Delete" button in this column. Clicking this button will delete the line.
* __example__: todo

### componentOrder
* __type__: `Array`
* __defaults__: [ 'title', 'tip', 'toolbar', 'search', 'table', 'pagination' ]
* __details__: 

	STable consists of several "parts": title, tip, toolbar, search, table, pagination. With __componentOrder__, we can adjust the order of the components themselves. For example, if you want to display the toolbar below the table, you can set it like this:
	```js
	STable.init({
		//some other config
		componentOrder: ['search', 'table', 'toolbar', 'pagination']
	})
	```
* __example__: todo

### downloadable
* __type__: `Boolean|String`
* __defaults__: false
* __details__: 

	Controls the display of the Export Table button. Click "Export Current Page" to download the data of the current page; click "Export All Pages" will download the data of all pages. The optional values are:
	* true, Display both the "Export current page" and "Export all pages" buttons in the toolbar
	* false, Will not display the download button
	* 'single', Display only the "Export Current Page" button
	* 'all', Display only the "Export All Pages" button
* __example__: todo


### downloadAllFromJustOnePage
* __type__: `Boolean`
* __defaults__: false
* __details__: 

	When the form is downloaded in full, all data is requested by page. However, sometimes paging requests for data is slower than exporting all data. To solve this problem, you can use this variable. Set it to __true__, when the full amount is exported, only one page of the request is issued, and the parameter count value is "max" to identify that the request is expected to be able to request all the data that meets the requirements.
* __example__: todo


### downloadTimeout
* __type__: `Number`
* __defaults__: 30000
* __details__: 

	The timeout for the download (milliseconds). When all data is downloaded in full, the data is requested by page, and this parameter can be used to specify the timeout for each page request. If it times out, the request will be interrupted and one will be re-initiated.
* __example__: todo

### dynamicParallelCount
* __type__: `Boolean`
* __defaults__: false
* __details__: 

	When downloading a table in full, dynamically adjust the maximum number of parallels based on the download speed.
* __example__: todo


### editConfig
* __type__: `Array`
* __details__: 

	The detailed settings of the form in the dialog window when adding or editing a row of data.
* __example__:
	* todo
	* form配置



### el
* __type__: `String|HTMLElement`
* __defaults__: "#stableContainer"
* __details__: 

	A dom container for STable, it can be a css selector, or a dom element.
* __example__: todo


### groupBy
* __type__: `Array|String`
* __details__: 

	Merge grouping according to the specified column. You can specify multiple columns, we will merge them first in order with the values of the first column; then for each merged group, use the second column to merge again; and so on.
* __example__: todo

### idIndex
* __type__: `String`
* __details__: 

	In the crud operation (addition, deletion, and change), when the row is modified or deleted, the parameter is used to uniquely identify the row data and send it to the backend.
* __example__: todo

### ignoreEmptySearchParam
* __type__: `Boolean`
* __defaults__: true
* __details__: 

	Ignore empty strings in search criteria when requesting data.
* __example__: todo

### labelVisible
* __type__: `Boolean`
* __defaults__: true
* __details__: 

	Controls whether the label of the form in the search area is displayed. When there are too many search terms, setting this parameter to false will make the search area appear more compact.
* __example__: 

### layoutMode
* __type__: `String`
* __defaults__: "fixed"
* __details__: 

	The layout of the area where STable is located. The following two values are optional:
	* "fixed", Fixed height mode. The area of the STable is fixed in height, and the height of the table area is determined based on the overall height, toolbar, search area, and paging area.
	* "expand", Automatic stretch mode. The height of the STable is not fixed, and the height of the STable is automatically adjusted according to the number of rows in the table area.
* __example__: 

### locale
* __type__: `String|Object`
* __details__: 

	The language configuration used by STable.
* __example__: todo

### sublistAt
* __type__: `Array|String`
* __details__: 

	The data for the specified column is an array, and each item in the array is shown in a row in this column.
* __usage__: 
	```JS
	STable.init({
		//sublistAt: ['movieType','movieName']
		sublistAt: 'movieType'
	});
	```
* __example__: 

### listeners
* __type__: `Object`
* __details__: 

	STable triggers different hook functions at different times, and developers can customize different functions in hook functions.
* __usage__: 
	```JS
	STable.init({
		//some other config
		listeners: {
			ready(){
				$.get('/log/stableCreate').then(()=>{
					//After the STable is initialized, the dot function is executed.
				});
			},
			refresh(records){
				//After the data is refreshed, do some processing on the current data.
				let count = records.length;
				console.log(`we get ${count} records`);
			}
		}
	});
	```
* __example__: 
	* [event](##listeners)

### page
* __type__: `Number`
* __defaults__: 1
* __details__: 
  
	The page number that was initially loaded.
* __usage__: 
	```JS
	STable.init({
		//some other config
		//Attention please, Page number starts from 1.
		page: 1,
	});
	```

### pageMode
* __type__: `String`
* __defaults__: "normal"
* __details__: 

	Paging mode. Currently supports two modes:
	* normal: Defaults, The data content of each page needs to be determined by the page number and the number of lines per page.
	* waterfall: Waterfall flow mode, you need to find the previous page or the pageIndex of the last row of data according to the pageIndex of the first row of the current page to find a page of data.
* __usage__: 
  ```JS
	STable.init({
		//some other config
		//pageMode: ‘waterfall’
		pageMode: 'normal',
	});
	

### pageIndex
* __type__: `String` 
* __defaults__: "id"
* __details__: 

	If the paging mode is 'waterfall', you need to specify which data field determines the paging. The default value is id.
* __usage__: 
  ```JS
	STable.init({
		//some other config
		//pageIndex requires uniqueness.
		pageIndex: 'id',
	});

### parallelCount
* __type__: `Number` 
* __defaults__: 6
* __details__: 

	Number of concurrent requests allowed when downloading a table in full.
* __usage__: 
  ```JS
	STable.init({
		//some other config
		parallelCount: 6,
	});

### params
* __type__: `Object`
* __defaults__:
	```json
	params: {
		count: 20
	}
	```
* __details__: 

	When pulling each page of data from the server, the value in 'params' is sent as a parameter. Using this parameter allows developers to customize some parameters and send them to the list interface. such as:
	```json
	params: {
		//Request 100 pieces of data per page instead of the default 20.
		count: 100
	}
	```

### records
* __type__: `Array` 
* __details__: 

	Statically, after setting it, it will not dynamically load the page data, but directly display the static table data it defines.
* __usage__: 
  ```json
	//Static data list
	records: [],
	```

### rowNumberVisible
* __type__: `Boolean`
* __defaults__: false
* __details__: 

	Whether to display the line number at the beginning of the line.
* __usage__: 
  ```JS
	STable.init({
		//some other config
		rowNumberVisible: true,
	});

### searchFilter
* __type__: `array|Object`
* __details__: 

	The configuration of the search area. The search area is essentially a form, the search configuration is actually the configuration of the form item.
* __usage__: 
  ```JS
	STable.init({
		searchFilter: [
			{
				label: 'Name',
				name: 'name'
			}
			//some other config
		],
	});
* __example__:
  
	* [Form configuration](#form配置)

### searchResetable
* __type__: `Boolean`
* __defaults__: false
* __details__: 

	Whether to display the "Reset" button in the search area.
* __usage__: 
  ```JS
	STable.init({
		//some other config
		searchResetable: false,
	});

### selectMode
* __type__: `String`
* __defaults__: "none"
* __details__: 

	The selection mode of the line. After the row is selected in the radio button or check box, all selected rows can be obtained by the 'getSelectedRows' interface.
	* 'none', Do not display the selection button in front of the table row.
	* 'single', radio mode, display radio button in front of the table row.
	* 'multiple', multi-select mode, display multi-select button in front of the table row.
* __usage__: 
  ```JS
	STable.init({
		//some other config
		//Defaults: none。Radio: single, multi-selec: multiple
		selectMode: 'none',
	}); 

### sortKey
* __type__: `String`
* __details__: 

	The default key used for sorting, which determines the value of the sort_key field when requesting page data.
* __usage__: 
  ```JS
	STable.init({
		//some other config
		//The default key used for sorting
		selectMode: 'id',
	}); 

### sortDirection
* __type__: `String`
* __defaults__:  "asc"
* __details__: 

	Like sortKey, 'sortDirection' determines the default sort direction
* __usage__: 
  ```JS
	STable.init({
		//some other config
		//Default sort ascending(asc), optional value descending(desc)
		sortDirection: 'asc',
	});

### titleVisible
* __type__: `Boolean`
* __defaults__: false
* __details__: 

	Whether to display the title bar.
* __usage__: 
  ```JS
	STable.init({
		//some other config
		//The default value is false, Optional value: true
		titleVisible: false,
	});

### toolbar
* __type__: `Array`
* __details__: 

	The toolbar of the table, which is a button or separator.
* __usage__: 
  ```js
	Stable.init({
		toolbar: [
			{
				text: 'DELETE',
				icon: 'close',
				type: 'danger',
				click(){
					console.log(this.getSelectedRows())
				}
			}
		]
	})
	```
* __example__: 
<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="result" data-user="cocopang" data-slug-hash="XWreYEo" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="toolbar">
  <span>See the Pen <a href="https://codepen.io/cocopang/pen/XWreYEo/">
  toolbar</a> by ccpang (<a href="https://codepen.io/cocopang">@cocopang</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### updateUrl
* __type__: `String`
* __details__: 

	The commit URL when modifying row data. If this parameter is present, a column will be added at the end of each line. There is a "Modify" button in this column. Clicking this button will display the modification window.
* __usage__: 
  ```js
	Stable.init({
		updateUrl: '/demo/ajaxUpdate',
	})
	```

### url
* __type__: `String`
* __details__: 

	An asynchronous interface that requests data per page.
* __usage__: 
  ```js
	Stable.init({
		url: '/demo/ajaxList',
	})
	```

## 事件
 This refers to the current STable instance in the listener function for all events. Of course, if you use the arrow function, etc., it is another matter.

### ready
* __details__:

	Triggered after the STable is initialized. Suitable for some preparatory work, such as event binding, data preparation, similar to the browser's domready.
* __usage__: 
	```JS
	STable.init({
		//some other config
		listeners: {
			ready(){
				console.log('The window is initialized.');
			}
		}
	});
	```

### refresh
* __Parameters__:
	* records, `Array`, Page refreshed data
* __details__:

	Triggered after loading a new page of data. You can do some processing on the raw data.
* __usage__: 
	```JS
	STable.init({
		//some other config
		listeners: {
			refresh(records){
				console.log(`${records.length} pages in total`);
			}
		}
	});
	```

### beforeadd
* __Parameters__:
	* data `Object`, The data to be added
* __details__:

	Triggered before adding data, you can process the data before the request is sent.
	::: tip
	If beforeadd's trigger function returns false, this add action will be interrupted.This function can be used to check the data before committing. Once an error is reported, the add action can be interrupted.
	:::
	```JS
	STable.init({
		//some other config
		listeners: {
			beforeadd(data){
				let name = data.name;
				if(!name || name.length<10){
					alert('The name cannot be empty and is greater than 10 characters!');
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
	* data, `Object`, The data to be added.
* __details__:

	Triggered when adding data. Here you can do some processing on the data to be added before the request is sent.
	::: tip
	If the trigger function of beforeadd returns false, this add action will also be interrupted.
	:::
* __usage__: 
	```JS
	STable.init({
		//some other config
		listeners: {
			add(data){
				let name = data.name;
				if(!name || name.length<10){
					alert('The name cannot be empty and is greater than 10 characters!');
					return false;
				}
			}
		}
	})
	```
### beforeedit
* __Parameters__:
	* data, `Object`, The data to edit.
* __details__:

	Triggered before modifying a row of data, where you can do some processing on the data to be edited before the request is sent.
* __usage__: 
	::: warning
	If the trigger function of beforeedit returns false, the modification action will be interrupted.
	:::
	```JS
	STable.init({
		//some other config
		listeners: {
			beforeedit(data){
				let name = data.name;
				if(!name || name.length<10){
					alert('The name cannot be empty and is greater than 10 characters!');
					return false;
				}
			}
		}
	})
	```

### edit
* __Parameters__:
  * data, `Object`, The data to edit.
* __details__:

	Triggered when a row of data is modified, where the data to be edited is processed and sent.
* __usage__: 
	```JS
	STable.init({
		//some other config
		listeners: {
			edit(data){
				let name = data.name;
				if(!name || name.length<10){
					alert('The name cannot be empty and is greater than 10 characters!');
					return false;
				}
			}
		}
	})
	```

### search
* __Parameters__:
  * evt, `Object`, Search request parameters.
* __details__:

	Triggered during search, you can process the parameters during the search.
* __usage__: 
  ::: warning
	If the search trigger function returns false, the search action will be interrupted.
	:::
  ```js
	Stable.init({
		//some other config
		listeners: {
			search(evt) {
				let searchParams;
				searchParams = this.trimParam(evt);
				//send request
			},
		}
	})

### beforedatarequest
* __Parameters__:
  * params, `Object`, Search parameters
* __details__:
  
  This method can be used to assemble or verify parameters before sending a request.
* __usage__: 
  ```js
	Stable.init({
		//some other config
		listeners: {
			beforedatarequest(params) {
				let ajaxOptions = {url:this.url, data: params, type:this.actionMethods.read, timeout: this.downloadTimeout};
				//send request
			},
		}
	})

### dataload
* __Parameters__:
	* responseData, `Object`, Original data just downloaded
* __details__:
  
	This function is triggered after downloading a new page of data from the network, where some preprocessing can be done on the raw data.
* __usage__: 
  ```js
	Stable.init({
		//some other config
		listeners: {
			dataload(data) {
				let name = data.name;
				if(!name || name.length<10){
					alert('The name cannot be empty and is greater than 10 characters!');
					return false;
				}
			},
		}
	})

## Instance method
### refresh

#### __Introduction__ :Triggered after loading a new page of data, used in listeners, used to process the original data.
```js
listeners: {
	refresh(records){
		//After the data is refreshed, you can do some processing on the data.
		let count = records.length;
		console.log(`we get ${count} records`);
	}
}
```
### layout

#### __Introduction__ :Called when the table data changes affect the layout.
```js
dataChange(): {
	//Data change logic
	//Call method
	this.layout();
}
```

### getSelectRows

#### __Introduction__ :Get the selected row in the table table, the return value is an `Array`.
```js
getSelectRows(): {
	//Operation array[records]
}
```
### getSearchParam

#### __Introduction__ :Get the current search form content, the return value is the formData object, you can use the append() method to add a field (type can be `Blob` or `File`).
```js
handleSubmit(target): {
	let formData = getSearchParam(target);
	target.append('name','豆豆')
	console.log(target);
}
```

### setRecords

#### __Introduction__ :设置表格数据, 无需手动刷新。
```js
let dataList;
//dataList = res.data.list
this.setRecords(dataList);
```
## column配置
#### __类型__: `Array|Object`
* __details__: 

	表格的列配置。数据中的每一项对应表格中的一列, 通过它配置此列的表头、表格内容以及展示样式。
* __usage__: *表示必填项
	```js
	columns: [
		{
			header: 'id', //* 每列的title
			dataIndex:'id', //* 对应数据的字段名
			width: 100, // 宽度（可不填）
			locked: true, // 是否锁定, 默认左侧锁定 可选值：right
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
* __example__: todo

#### __Introduction__ :设置表格数据, 无需手动刷新。
```js
let dataList;
//dataList = res.data.list
this.setRecords(dataList);
```

## form配置
* __Introduction__:由输入框（input/textarea）、选择器(select)、单选框(radio)、多选框(checkbox)、开关（switch）、文件上传（file）等控件组成, 用以收集、校验、提交数据。可以单独作为组件使用（x-form）, 也可集成在STable使用, 详见demo。
  
### 集成在Stable:

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="result" data-user="cocopang" data-slug-hash="vYBWGZY" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="vYBWGZY">
  <span>See the Pen <a href="https://codepen.io/cocopang/pen/vYBWGZY/">
  vYBWGZY</a> by ccpang (<a href="https://codepen.io/cocopang">@cocopang</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### 单独使用form组件:

* __inline__: 
  * `Boolean` 默认false 纵向布局, 当垂直方向空间受限且表单较简单时（比如搜索）可以设置为true, 表示在一行内放置表单。
	
* __size__: 
	* `String` 默认值'small', 可选项'small', 'middle', 'large'。

* __labelVisible__: 
	* `Boolean` 
	* 默认值true, 是否显示form表单的label。

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

	1. 用在toolbar时, 它有两个参数：
		* btnConfig, 此按钮的配置
		* event, 当前点击事件

	1. 用在column时, 它有三个参数：
		* record, 当前行数据原始值
		* btnConfig, 此按钮的配置信息
		* event, 当前点击事件

### cls
* 类型：String
* 详细：
按钮上附加的样式class, 用于自定义按钮样式。

### icon
* 类型：string
* 详细
对应font-awsome中的字体图标, 比如icon:'plus', 就是在此按钮上显示一个glyphicon-plus图片, 即一个加号图标。
* 参考：
	* [font awsome的图标](https://doc.wfxteam.com/html/fa.html)

### style
* 类型：Object
* 详细：
按钮上附加的style样式, 用于自定按钮样式。

### text
* 类型：string
* 详细：
按钮上显示的文本。

### type
* 类型：string
* 默认值：'default'
* 详细：
对应bootstrap中对按钮类型的设定, 它有 default / primary / success / warning / danger / info / text	。不同类型对应按钮的颜色不一样。

### visible
* 类型：Boolean|<String,String>|Function
* 默认值：true
* 详细：
是否显示此按钮。仅对行中显示button有效。
	* 当visible为数组时, 数组第一项为dataIndex, 第二项为对比值, 当某行中, dataIndex对应的数据和对比值一样时, 才会显示此按钮。
	* 当visible为函数时, 函数的返回值为true时, 显示此按钮；否则不显示

## dialog配置

* 弹框组件。用Dialog.create方式可生成一个完成的dialog实例, 也可以使用快捷的功能函数alert\confirm\prompt。

### Dialog.qtip(msg[, type[, config]])
在页面顶部显示一个快速的tip, 类似于toast。
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
	* 详情：颜色类型, 可选值有 success/warning/info/error
* config
	* 类型：Object
	* 详情：config下所有可配置的参数：
		* message, String, 会重写msg参数
		* type, String, 会重写type参数
		* duration, Number, 显示时间, 毫秒。默认为3000。

### Dialog.alert(msg[, title[, config]])
显示一个带消息的警告框。

使用方法：
```javascript
Dialog.alert('这是一个提示');
Dialog.alert('这是一个提示', '提示');
Dialog.alert('这是一个提示', {
	fn(){
		alert('这里是关闭提示时, 做的一些动作');
	}
});
Dialog.alert('这是一个提示', '提示', {
	fn(){
		alert('这里是关闭提示时, 做的一些动作');
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
		* message, String, 会重写msg参数
		* title, String, 会重写type参数
		* fn, Function, 关闭对话框时触发的函数

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
		* message, String, 会重写msg参数
		* title, String, 会重写type参数
		* fn, Function, 关闭对话框或者点击按钮时触发的函数, 参数有：
			* ret, String, 为'yes'时表明点击了“确定”按钮；为“no”时表明点击了“取消”或“关闭”按钮

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
		* message, String, 会重写msg参数
		* title, String, 会重写type参数
		* fn, Function, 关闭对话框或者点击按钮时触发的函数, 参数有：
			* ret, String, 用户输入的内容

### Dialog.create(config)
标准的窗口组件, 通过config参数来配置不同的窗口。config的参数有：
`注意, 上面的qtip和对话框都不是真正的窗口组件, 只是挂在Dialog下的快捷使用入口`

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
	* 详细：窗口内的元素。注意, contentEl和html都是指定窗口内展示的内容, 不过contentEl是dom元素, 可以是页面中已存在的, 也可以是通过document.creatElement创建的；html是html代码字符串
* width
	* 类型：Number/String
	* 默认值：640
	* 详细：窗口的宽度。可以是具体的数值, 也是可以百分比, 如'80%'
* height
	* 类型：Number/String
	* 默认值：480
	* 详细：窗口的高度。可以是具体的数值, 也是可以百分比, 如'80%'
* autoShow
	* 类型：Boolean
	* 默认值：true
	* 详细：窗口创建好之后, 是不是立即显示出来。如果为false, 就需要程序在合适时机调用show方法显示出来
* closable
	* 类型：Boolean
	* 默认值：true
	* 详细：在标题区域显示一个关闭按钮。注意, 这个参数并不是限制窗口关闭不了, 只是不显示右上角的关闭按钮
* modal
	* 类型：Boolean
	* 默认值：true
	* 详细：窗口是不是模态的。模态窗口会显示一个遮罩层, 遮罩使页面中除了窗口, 其它地方都不可点击
* closeAction
	* 类型：String
	* 默认值：'destroy'
	* 详细：关闭窗口时执行的动作。
		* 'destroy', 关闭窗口后直接销毁它
		* 'close', 关闭窗口后元素不销毁, 可以再次通过show方法显示出来
* listeners
	* 类型：Object
	* 详细：窗口支持的事件
		* ready, 窗口dom元素创建之后触发
		* beforeshow, 窗口show动作执行前触发
		* beforehide, 窗口隐藏前触发。注意hide命令只隐藏窗口, 不销毁它
		* beforeclose, 窗口关闭动作执行前触发
		* close, 窗口关闭后触发
		* destroy, 窗口销毁后触发
* buttons
	* 类型：Array
	* 详细：buttons中的每一项是一个按钮的配置
	* 参考：
		* [按钮配置](##button配置)

### Dialog的实例方法
通过Dialog.create方法创建的Dialog实例, 有一些方法, 控制窗口的行为。
* show(), 使窗口显示出来
* hide(), 隐藏窗口, 并且不销毁dom
* close(), 隐藏窗口, 然后根据closeAction决定是否要销毁窗口dom