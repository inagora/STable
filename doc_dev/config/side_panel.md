# SidePanel
---
SidePanel是一个从右侧边弹出的浮层，它的内容可以是html字符串，也可以一个页面地址。

## SidePanel.show(content[, title])
把content中的html内容在sidePanel中显示出来。参数：
* content
	* 类型：String
	* 详细：要显示html字符串
* title
	* 类型：String
	* 详细：sidepanel的标题

## SidePanel.showPage(url[, title[, options]])
在sidePanel中以iframe的形式显示出来url页面。参数：
* url
	* 类型：String
	* 详细：要显示的页面地址
* title
	* 类型：String
	* 详细：sidepanel的标题

## SidePanel.hide()
隐藏SidePanel