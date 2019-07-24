# API

## 配置
使用STable，基本就是和配置参数打交道。

对于一些过时的参数，我们会打上<sup style="color:red">dep</sup>标识。

### actionMethods
* __Type__: `Object`
* __Default__:
```
{
	create: 'POST',
	read: 'GET',
	update: 'POST',
	delete: 'POST'
}
```
* __Detail__:
	
	不同请求所使用的请求方法，包括列表、添加、修改、删除。

* __Usage__:
	``` js
	STable.init({
		//some other config
		actionMethods: {
			read: 'POST'	//把列表请求换成post方式
		}
	});
	```
* __See also__: todo

### addUrl
* __Type__: `String`
* __Detail__:

	添加数据时的提交地址。如果有此参数，会在工具栏toolbar自动显示一个“添加”按钮。

* __See also__: todo

### batDeleteUrl
* __Type__: `String`
* __Detail__: 

	批量删除数据时的提交地址。如果有此参数，会在工具栏toolbar自动显示一个“批量删除”按钮，点此按钮，会把所有选中行删除。需要配合参数selectMode使用。
* __See also__: 
	* todo
	* [行选择模式 selectMode](#selectMode)

### columns
* __Type__: `Array|Object`
* __Detail__: 

	表格的列配置。数据中的每一项对应表格中的一列，通过它配置此列的表头、表格内容以及展示样式。
* __Usage__: todo
* __See also__: todo

### deleteUrl
* __Type__: `String`
* __Detail__:

	删除数据时的提交地址。如果有此参数，会在每一行的最后添加一列，此列中有一个“删除”按钮，点此按钮，会删除此行。
* __See also__: todo


### downloadable
* __Type__: `Boolean|String`
* __Default__: false
* __Detail__: 

	控制导出表格按钮的显示。点击“导出当前页”可以下载当前定页的数据；点击“导出所有页”会把所有页的数据都下载下来。可选的值有：
	* true，在工具栏toolbar同时显示“导出当前页”和“导出所有页”两个按钮
	* false，不会显示下载按钮
	* 'single'，只显示“导出当前页”按钮
	* 'all'，只显示“导出所有页”按钮
* __See also__: todo


### downloadAllFromJustOnePage
* __Type__: `Boolean`
* __Default__: false
* __Detail__: 

	全量下载表格时，会分页把所有数据请求下来。不过有时候分页请求数据反而没有一次性把所有数据导出来快。为了解决这个问题，可以使用这个变量。把它设置为true，全量导出时，只发出一页的请求，并且参数 count 值为 "max"，以标识这次请求希望能把符合要求的所有数据一次数请求到。
* __See also__: todo


### downloadTimeout
* __Type__: `Number`
* __Default__: 30000
* __Detail__: 

	超时时间(毫秒)。全量下载所有数据时，会分页面请求数据，可以用此参数指定每个页面请求的超时时间。如果超时，会中断请求，重新发起一个。
* __See also__: todo


### editConfig
* __Type__: `Array`
* __Detail__: 

	添加或者编辑一行数据时，弹窗中表单的详细设置。
* __See also__:
	* todo
	* form配置



### el
* __Type__: `String|HTMLElement`
* __Default__: "#stableContainer"
* __Detail__: 

	STable在页面中的dom容器，它可以是css选择器，也可是一个dom元素。
* __See also__: todo


### groupBy
* __Type__: `Array|String`
* __Detail__: 

	根据指定的列进行合并分组。可以是指定多个列，按顺序，先用第一个列的值进行合并；然后对每个合并后的组，使用第二个列进行再次合并；以此类推。
* __See also__: todo

### idIndex
* __Type__: `String`
* __Detail__: 

	crud操作(增删改查)中，修改或者删除行时，由此参数来唯一标识行数据，并发给服务端。
* __See also__: todo

### labelVisible
* __Type__: `Boolean`
* __Default__: true
* __Detail__: 

	搜索区的表单的标签是否显示。当搜索项太多时，把此参数设为false，可以让搜索区显得更为紧凑。
* __See also__: 

### layoutMode
* __Type__: `String`
* __Default__: "fixed"
* __Detail__: 

	stable所在区域的布局，有下面两个值：
	* "fixed"，固定高度模式。STable所在区域高度固定，会根据总体高度、工具栏、搜索区和分页区，决定表格区的高度
	* "expand"，自动伸展模式。STable高度不固定，根据表格区行数不同，自动调整STable的高度。
* __See also__: 

### sublistAt
* __Type__: `Array|String`
* __Detail__: 

	把指定列的cell渲染成多行。
* __See also__: 

### listeners
* __Type__: `Object`
* __Detail__: 

	STable在不时机触发一些钩子函数，开发者可以在这些时机做一些自己的功能。
* __Usage__: 
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
* __See also__: 
	* [事件](##listeners)

### 
* __Type__: ``
* __Default__: 
* __Detail__: 
* __Usage__: 
* __See also__: 

### 
* __Type__: ``
* __Default__: 
* __Detail__: 
* __Usage__: 
* __See also__: 

### 
* __Type__: ``
* __Default__: 
* __Detail__: 
* __Usage__: 
* __See also__: 

### 
* __Type__: ``
* __Default__: 
* __Detail__: 
* __Usage__: 
* __See also__: 

### 
* __Type__: ``
* __Default__: 
* __Detail__: 
* __Usage__: 
* __See also__: 

### 
* __Type__: ``
* __Default__: 
* __Detail__: 
* __Usage__: 
* __See also__: 

### 
* __Type__: ``
* __Default__: 
* __Detail__: 
* __Usage__: 
* __See also__: 

### 
* __Type__: ``
* __Default__: 
* __Detail__: 
* __Usage__: 
* __See also__: 

### 
* __Type__: ``
* __Default__: 
* __Detail__: 
* __Usage__: 
* __See also__: 

### 
* __Type__: ``
* __Default__: 
* __Detail__: 
* __Usage__: 
* __See also__: 

### 
* __Type__: ``
* __Default__: 
* __Detail__: 
* __Usage__: 
* __See also__: 

### 
* __Type__: ``
* __Default__: 
* __Detail__: 
* __Usage__: 
* __See also__: 

### 
* __Type__: ``
* __Default__: 
* __Detail__: 
* __Usage__: 
* __See also__: 

### 
* __Type__: ``
* __Default__: 
* __Detail__: 
* __Usage__: 
* __See also__: 




## 事件
所有事件的监听函数中this都指向当前STable实例。当然，如果你用箭头函数等方式，就另当别论了。
### ready
* __Detail__:

	在STable初始化之后触发。适合作一些准备工作，如事件绑定、数据准备，类似于浏览器的domready

### refresh
* __Parameters__:
	* records，`Array`，刷新后页面的数据 
* __Detail__:

	加载完新一页数据后触发。可以对原始数据做一些处理。
* __Usage__: 
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
* __Detail__:

	添加数据前触发。可以在此对要添加的数据在请求发送前做一些处理
	::: tip
	如果beforeadd的触发函数返回了false，就会中断本次添加动作。这个特性可以用来做数据提交前的检查，一旦发现有问题，可以用它中断添加动作。
	:::
* __Usage__: 
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
* __Detail__:
* __Usage__: 

### beforeedit
* __Parameters__:
* __Detail__:
* __Usage__: 

### edit
* __Parameters__:
* __Detail__:
* __Usage__: 

### search
* __Parameters__:
* __Detail__:
* __Usage__: 

### beforedatarequest
* __Parameters__:
* __Detail__:
* __Usage__: 

### dataload
* __Parameters__:
* __Detail__:
* __Usage__: 


## 实例属性

## 实例方法