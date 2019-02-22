# columns列配置

## buttons
* 类型：Array
* 详情
如果设置了buttons，那此列的类型type为自动认为是'button',会显示为按钮。

## cellWrap
* 类型：Boolean
* 默认：true
* 详情
如果cell中内容超出了cell的宽度，如何处理。为true，自动换行；为false，自动隐藏

## cls
* 类型：string
* 详细：
表格体中，此列附加的class样式名。

## dataIndex
* 类型：String
* 详细：
指定此列对应的数据项，它决定了此列显示什么。列的配置被存储下来时，也以它为基础。如果没有指定此项的值，系统为自动生成一个。

## flex
* 类型：Number
* 详细：
此列宽度所占可分配总宽度的比重。

## header
* 类型：String
* 详细：
此列在表头显示的标题内容

## locked
* 类型：Boolean
* 默认：false
* 详细：
列是不是被锁定。锁定的列显示在表格左边，不会随底部滚动条一起移动。

## minWidth
* 类型：Number
* 详细：
此列最小宽度

## maxWidth
* 类型：Number
* 详细：
此列最大宽度

## render
* 类型：Function
* 参数：
	* rowData，此列的数据内容
	* columnConfig，此列的列配置
* 详细：
	自定义此列的内容展示。要求render函数返回要显示的内容字符串，可以是html代码。这是最灵活的展示方式了，完全由使用者自定义。

## sortable
* 类型：Boolean
* 默认值：false
* 详细：
此列是否可排序。如果为true，那在点击表头此列时，会以此列dataIndex为sort_key，进行数据请求。

## style
* 类型：Object
* 详细：
表格体中，此列附加的样式。

## type
* 类型：string
* 默认值：'text'
* 详细：
大部分情况下，不用指定此项的值，STable会根据是否有list、buttons、checkbox、radio等参数，自动判断type类型。不过下拉选择有三种状态，select、combobox、multiple，它们都依赖于list，需要时要明确指定type的值。type可选的值有：
	* 'text'，直接显示dataIndex对应的文本内容
	* 'button'，显示为按钮
	* 'image'，显示为图片
	* 'tag', 带颜色的文字

## visible
* 类型：Boolean
* 默认值：true
* 详细：
此项决定列默认是不是显示出来

## width
* 类型：Number
* 详细：
此列的固定宽度，以px为单位。

