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
  
	* [Form configuration](#Form-Configuration)

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

## Event
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

## Instance Method
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
	target.append('name','coco')
	console.log(target);
}
```

### setRecords

#### __Introduction__ :Set the table data and refresh it automatically.
```js
let dataList;
//dataList = res.data.list
this.setRecords(dataList);
```
## Column Configuration
#### __Type__: `Array|Object`
* __details__: 

	The column configuration of the table. Each item in the data corresponds to a column in the table, which configures the header, table contents, and presentation style of this column.

* __usage__: * indicates required fields
	```js
	columns: [
		{
			header: 'id', //* Title of each column
			dataIndex:'id', //* Field name for each column of data
			width: 100, // Width (not required)
			locked: true, // Whether to lock, default left lock Optional value: right
			sortable: true, // Whether to sort
			render(record){ // Rendering the current row data processing
				return record.actors.join(' | ');
			},
			buttons: [{ // buttons configuration
				text: 'fff', // Text color of button
				click(){  // Operation function
					console.log(this);
				},
				icon: 'st-iconfont st-icon-eye', //button with icon
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

## Form-Configuration
* __Introduction__: It consists of input/textarea, select, radio, checkbox, switch, file, etc. to collect, verify, and submit data. It can be used as a component (x-form) or integrated in STable. See demo.
  
### Used in Stable:

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="result" data-user="cocopang" data-slug-hash="vYBWGZY" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="vYBWGZY">
  <span>See the Pen <a href="https://codepen.io/cocopang/pen/vYBWGZY/">
  vYBWGZY</a> by ccpang (<a href="https://codepen.io/cocopang">@cocopang</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

### Use the form component alone:

* __inline__: 
  * `Boolean` Default false Vertical layout, when the vertical space is limited and the form is simple (such as search) can be set to true, indicating that the form is placed in a row.。
	
* __size__: 
	* `String` Defaults 'small', Optional 'small'|'middle'|'large'。

* __labelVisible__: 
	* `Boolean` 
	* The default value is true, whether to display the label of the form.

* __fieldList__: 
	* `Object` Form configuration item.

* __submit__: 
	* A request submitted by a form submission.

<p class="codepen" data-height="265" data-theme-id="light" data-default-tab="result" data-user="cocopang" data-slug-hash="NWKpLrv" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="NWKpLrv">
  <span>See the Pen <a href="https://codepen.io/cocopang/pen/NWKpLrv/">
  NWKpLrv</a> by ccpang (<a href="https://codepen.io/cocopang">@cocopang</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Button-Configuration

Can be used in the configuration of toolbar, column, form form. There are several configuration items:

### click
* Type: Function
* Details: 
	The function that is triggered when the button is clicked, whose this points to the STable instance.

	1. When used in the toolbar, it has two parameters:
		* btnConfig, Configuration of this button
		* event, Current click event

	1. When used in column, it has three parameters:
		* record, Current row data raw value
		* btnConfig, Configuration of this button
		* event, Current click event

### cls
* Type: String
* Details: 
A style class attached to the button for custom button styles.

### icon
* Type: string
* Details: 
	* Old version: [font-awsome](https://doc.wfxteam.com/html/fa.html)<sup style="color:red">dep</sup> font icon, such as icon: 'plus', is to display a glyphicon-plus image on this button, which is a plus icon.
	* New version: Does not rely on font-awesome, has its own icon library.
	* demo: 
  ```html
	<div class="st-iconfont st-icon-delete">DELETE</div>
	```
  ![stble图标](/img/st-iconfont.png)


### style
* Type: Object
* Details: 
A style style attached to the button for custom button styles.

### text
* Type: string
* Details: 
The text displayed on the button.

### type
* Type: string
* Defaults: 'default'
* Details: 
Corresponding to the button type setting in bootstrap, it has default/primary/success/warning/danger/info/text. The colors of the corresponding buttons of different types are different.

### visible
* Type: Boolean|<String,String>|Function
* Defaults: true
* Details: 
Whether to display this button. Only valid for displaying the button in the line.
	* When visible is an array, the first item of the array is dataIndex, and the second item is the comparison value. When the data corresponding to dataIndex is the same as the contrast value in a row, this button is displayed.
	* This button is displayed when the return value of the function is true when visible is a function; otherwise it is not displayed.
## Dialog Configuration

* The dialog component. Use 'Dialog.create()' to generate a completed dialog instance, or use the quick function function alert()\confirm()\prompt().

### Dialog.qtip()
* A quick tip is displayed at the top of the page, similar to toast.
  
* Qtip has a polymorphic form:
```js
Dialog.qtip(msg[, type[, config]]);
Dialog.qtip(msg[, config]);
Dialog.qtip(config);
```
[see also](/html/demo?demo=dialog)

__parameters__:
* msg
	* Type: `String`
	* Details: Message text
* type
	* Type: String
	* Details: Color type, optional values: success/warning/info/error
* config
	* Type: Object
	* Details: All configurable parameters under config:
		* message `String`, Will rewrite the 'msg' parameter
		* type `String`, Will rewrite the 'type' parameter
		* duration `Number`, Display time(ms). The default is 3000.

### Dialog.alert()
A warning box with a message is displayed.
* __Usage__: Dialog.alert(msg[, title[, config]])

* __Instructions__:
```javascript
Dialog.alert('This is a message');
Dialog.alert('This is a message', 'title');
Dialog.alert('This is a message', {
	fn(){
		alert('Some actions you do when you close the Dialog.');
	}
});
Dialog.alert('This is a message', 'title', {
	fn(){
		alert('Some actions you do when you close the Dialog.');
	}
});
```
* __parameters__:
  * msg
  	* Type: String
  	* Details: This is a message
  * title
  	* Type: String
  	* Details: The title of the Dialog.
  * config
  	* Type: Object
  	* Details: All configurable parameters under config:
      * message `String`, Will rewrite the 'msg' parameter
  		* type `String`, Will rewrite the 'type' parameter
  		* fn `Function`, Function triggered when the dialog is closed

### Dialog.confirm(msg[, title[, config]])
A dialog box with the specified message and the OK and Cancel buttons is displayed.

Instructions:
```js
Dialog.confirm('This is a message');
Dialog.confirm('This is a message', 'title');
Dialog.confirm('This is a message', {
	fn(ret){
		if(ret=='yes')
			alert('You have selected the OK button');
		else
			alert('You have chosen to close or cancel the button')
	}
});
```

__parameters__:
* msg
	* Type: String
	* Details: This is a message
* title
	* Type: String
	* Details: The title of the Dialog.
* config
	* Type: Object
	* Details: All configurable parameters under config:
    * message `String`, Will rewrite the 'msg' parameter
		* type `String`, Will rewrite the 'type' parameter
		* fn `Function`, Function that is triggered when the dialog is closed or when the button is clicked, The parameters are:
			* ret `String`, "yes" means clicking the "OK" button; "no" means clicking the "Cancel" or "Close" button

### Dialog.prompt(msg[, title[, config]])
A dialog box is displayed that prompts the user for input.

Instructions:
```js
Dialog.confirm('Need your input', {
	fn(ret){
		alert('What you typed is:'+ret);
	}
});
```

__parameters__:
* msg
	* Type: String
	* Details: This is a message
* title
	* Type: String
	* Details: The title of the Dialog.
* config
	* Type: Object
	* Details: All configurable parameters under config:
    * message `String`, Will rewrite the 'msg' parameter
		* type `String`, Will rewrite the 'type' parameter
		* fn `Function`, Function that is triggered when the dialog is closed or when the button is clicked, The parameters are:
			* ret `String`, User input

### Dialog.create(config)
Standard Dialog component, configure different windows with config parameters. The parameters of config are:
  
* title
	* Type: String
	* Defaults: ''
	* Details: Title of the 'Dialog'
* bodyCls
	* Type: String
	* Defaults: null
	* Details: The class name applied to the 'Dialog'
* bodyStyle
	* Type: Object
	* Details: The style applied to the window element
* contentEl
	* Type: dom element
	* Details: Elements within the 'Dialog'
* html
	* Type: String
	* Details: The elements within the 'Dialog'. Note that both contentEl and html are the contents of the specified window, but contentEl is a dom element, either existing in the page or created by `document.creatElement()`; html is the html code string
* width
	* Type: Number/String
	* Defaults: 640
	* Details: The width of the 'Dialog'. Can be a `Number`, but also a `percentage`, such as '80%'
* height
	* Type: Number/String
	* Defaults: 480
	* Details: The height of the 'Dialog'. Can be a `Number`, but also a `percentage`, such as '80%'
* autoShow
	* Type: Boolean
	* Defaults: true
	* Details: Whether the 'Dialog' is displayed immediately after the 'Dialog' is created. If it is false, you need the program to display the show method at the right time.
* closable
	* Type: Boolean
	* Defaults: true
	* Details: A close button is displayed in the title area. Note that this parameter does not limit the 'Dialog' to close, just does not display the close button in the upper right corner.
* modal
	* Type: Boolean
	* Defaults: true
	* Details: Whether the 'Dialog' is modal. The modal window will display a mask layer, the mask makes the page in addition to the window, other places are not clickable.
* closeAction
	* Type: String
	* Defaults: 'destroy'
	* Details: The action taken when the 'Dialog' is closed.
		* 'destroy', Destroy it directly after closing the window
		* 'close', After the 'Dialog' is closed, the element is not destroyed, and can be displayed again by the show method.
* listeners
	* Type: Object
	* Details: The events of the 'Dialog' compontent supported.
		* ready, Triggered after the 'Dialog' dom element is created.
		* beforeshow, Trigger before the 'Dialog' show function is executed.
		* beforehide, Triggered before the 'Dialog' is hidden. Note that the hide command only hides the window, does not destroy it.
		* beforeclose, Trigger before the 'Dialog' close action is executed.
		* close, Triggered when the 'Dialog' is closed
		* destroy, Triggered after the 'Dialog' is destroyed
* buttons
	* Type: Array
	* Details: Each item in the 'buttons' is a button configuration
	* 参考：
		* [Button Configuration](#button-configuration)

### Dialog's instance method
The Dialog instance created by the `Dialog.create()` has some methods to control the behavior of the 'Dialog'.
* show(), Make the 'Dialog' window appear.
* hide(), Hide the 'Dialog' window, but don't destroy the dom.
* close(), Hide the 'Dialog' window, then decide whether to destroy the 'Dialog' dom according to the closeAction.