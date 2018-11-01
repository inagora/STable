# STable
> STable是inagora公司内部后台使用的一个web ui工具，用来解决表格的展示，以及表格基础上的数据处理、下载等。STable是`Search Table`的缩写，故名思义就是一个带搜索功能的表格，因为它最原始的功能只有表格显示和搜索结果。然后在几年的使用和功能迭代后，沉淀为现在的UI风格和功能。

先看一个它的UI效果：
![STable](img/stable.jpg)

从UI上看，它包括标题、工具栏、搜索区、表格区、分页几个模块。为了方便开发，还提供了Dialog、SidePanel、Progressbar等组件。详细功能包括：
* table
	* 选中行高亮
	* 锁定列
	* 移动列
	* 控制列显示和隐藏
	* 保存列设置
	* 排序
	* 列类型
		* 图
		* button
		* tag
	* 显示行号
	* 行单选和多选
	* 瀑布流模式
	* 求和、求平均值
	* 列头注释
* 工具栏
	* crud操作，添加、删除、修改
	* 批量删除
	* 下载、全部下载
	* 按钮
* 搜索区
	* 列表拼音匹配
	* 下拉列表、异步下拉列表
	* input type
		* text
		* number
		* year、month、date
		* datetime
		* time
		* 带搜索的下拉列表
		* 下拉列表多选
* 标题
	* 标题
	* 标题栏是否显示
	* 列控制按钮
* pagebar
	* 普通模式
	* 瀑布流模式
* 数据的图表展示
* 常用组件
	* Dialog
	* SidePanel
	* Progressbar

#### STable的结构 {#struct}
从代码和设计看，STable的结构如下图：
![struct](img/struct.jpg)

分为几部分：
1. core，红色区域2，核心区代码包括STable显示和处理表格的功能
2. 红色区域1，Dialog、SidePanel之类为常用的UI组件
3. 绿色区域，Vue、element-ui为依赖库。整个STable都是用Vue开发的，一个mvvm的框架；element-ui是饿了么工司开源的一个UI组件库，STable用到的表单元素都是element-ui的。
4. 灰色区域，外部依赖库，echarts、sheetjs等，是STable部分功能会用到的库。Echarts是图表功能用到的UI工具；sheetjs是表格下载使用的工具；fontawesome是字体icon，多用到按钮上；pinyin是下拉选择时，方便中文搜索过滤使用的。

其中，红色区域会打包成STable.min.js和STable.min.css。红色区域+绿色区域，打包成STable.full.min.js和STable.full.min.css。如果使用到了表格下载等需要外部依赖的功能，会额外加载它们。如果没用到相关功能，不会加载这些依赖。
