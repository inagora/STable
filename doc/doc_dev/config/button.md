# 按钮配置
在toolbar和column配置时，都要用到按钮的配置。它有以下几个配置项：

## click
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

## cls
* 类型：String
* 详细：
按钮上附加的样式class，用于自定义按钮样式。

## icon
* 类型：string
* 详细
对应font-awsome中的字体图标，比如icon:'plus'，就是在此按钮上显示一个glyphicon-plus图片，即一个加号图标。也支持element ui的icon。
* 参考：
	* [font awsome的图标](https://doc.wfxteam.com/html/fa.html)
	* [element ui的图标](http://element-cn.eleme.io/#/zh-CN/component/icon)

## style
* 类型：Object
* 详细：
按钮上附加的style样式，用于自定按钮样式。

## text
* 类型：string
* 详细：
按钮上显示的文本。

## type
* 类型：string
* 默认值：'default'
* 详细：
对应bootstrap中对按钮类型的设定，它有 default / primary / success / warning / danger / info / text	。不同类型对应按钮的颜色不一样。

## visible
* 类型：Boolean|<String,String>|Function
* 默认值：true
* 详细：
是否显示此按钮。仅对行中显示button有效。
	* 当visible为数组时，数组第一项为dataIndex，第二项为对比值，当某行中，dataIndex对应的数据和对比值一样时，才会显示此按钮。
	* 当visible为函数时，函数的返回值为true时，显示此按钮；否则不显示