# 常见问题
刚使用STable时难免会遇到一些问题，本章会将一些出现频率比较高的问题总结出来，减少STable接入的时间。

## STable v1.x版本和v2.x版本有什么区别
* 文件更小了，但是功能没有减少，该有的还有，并且还增加了一些配置；
* 更专业，去掉一些冗余的功能，因为我们专注于表格；
* v2.x版本兼容了v1.x版本的配置，但是在使用新版本的时候最好使用新的配置方式，以免以后版本取消这些兼容代码；

## STable如何自定义列
默认的列显示没有特殊的样式，如果需要自定义样式，可以通过配置列的render属性，参考[render](/zh/api.html#render)

## STable如何添加一列数据
设置[addUrl](/zh/api.html#addUrl)会在工具栏toolbar自动显示一个“添加”按钮，点击此按钮出现“添加”面板。显示的编辑项为[addConfig](/zh/api.html#addConfig)中配置的表单项。

## STable如何编辑列
设置[addUrl](/zh/api.html#addUrl)会在工具栏toolbar自动显示一个“添加”按钮，点击此按钮出现“添加”面板。显示的编辑项为[addConfig](/zh/api.html#addConfig)中配置的表单项。

## 搜索区域的表单设置默认值
通过设置表单的[value](/zh/api.html#value)属性；

## 如何配置级联下拉选择
可以配置数据为嵌套[list](/zh/api.html#list);

## 如何获取选择的行
* v2.x版本可以通过STable的getSelected获取；
* v1.x版本通过getSelectedRows获取；

## 如何获取搜索的参数
STable初始化时候会返回一个实例，通过调用该实例的[getSearchParam](/zh/api.html#getsearchparam)方法获取当前搜索表单内容；
