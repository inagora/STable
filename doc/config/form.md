# form表单配置
添加、修改行数据时，出现的弹窗中是一个表单；搜索区也是一个表单。下面是表单项的配置。

## asyncList
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

## hidden
* 类型：boolean
* 默认值：false
* 详细：
当前表单项是否可见。有一些值需要一起提交，但不想展示给使用者，就可以设置hidden为true。

## label
* 类型：string
* 详细：
此表单项的标签，显示在输入框前面。

## list
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

## name
* 类型：string
* 详细：
当前表单项提交时的key。

## pattern
* 类型：string
* 详细：
表单的验证正则。这个配置虽然是个字符串，但它会直接赋值给input的pattern属性，所以它本身是一个正则发达式。

## placeholder
* 类型：string
* 详细：
输入框为空时的提示。如果此配置为空，为使用label的值做为placeholder。

## readonly
* 类型：boolean
* 默认值：false
* 详细：
当前表单项是否只读。

## required
* 类型：boolean
* 默认值：false
* 详细：
当前表单项必须有值，如果没有值，不准提交。

## title
* 类型：string
* 详细：
input输入验证失败时，比如正则验证失败、required为true但内容没有填写时，会显示title内容的提示。

## type
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

## format
* 类型：String
* 详细：
对于日期和时间选择器，它们都有自己的格式。如果你对它默认的格式不满意，可以用format自己设置。格式请参考[element-ui日期格式](http://element.eleme.io/#/zh-CN/component/date-picker#ri-qi-ge-shi)

## value
* 类型：string|Number|Date
* 详细：
当前表单项的默认值。

