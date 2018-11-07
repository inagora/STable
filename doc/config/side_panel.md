# SidePanel
---
SidePanel是一个从右侧边弹出的浮层，它的内容可以是html字符串，也可以一个页面地址。

## SidePanel.show(content[, title[, options]])
把content中的html内容在sidePanel中显示出来。参数：
* content
	* 类型：String
	* 详细：要显示html字符串
* title
	* 类型：String
	* 详细：sidepanel的标题
* options
	* 类型：Object
	* 详细：配置参数。目前支持的参数有：
		* title，String，sidePanel的标题
		* listeners，Object，一些SidePanel支持的事件
			* show，当SidePanel出现后触发
			* beforehide，当SidePanel隐藏前触发。注意，此时SidePanel内的demo结构还没有销毁；如果处理函数返回false，则不会关闭SidePanel
			* hide，当SidePanel隐藏后触发。注意，此时SidePanel内的dom已被销毁
```javascript
//显示一个不带标题的面板
SidePanel.show('<p>this is a demo</p>');
//显示一个带标题的面板
SidePanel.show('<p>this is a demo</p>', 'demo的标题');
//显示一个带村题的面板，在关闭前随机一个数，如果这个数大于0.5，就阻止关闭动作
SidePanel.show('<p>this is a demo</p>', {
	title: 'demo标题也可以写在这里',
	listeners: {
		beforehide(){
			if(Math.random()>0.5){
				return false;
			}
		}
	}
});
//显示一个不带标题的面板，关闭后显示一个提示
SidePanel.show('<p>this is a demo</p>', 'demo的标题', {
	listeners: {
		hide(){
			Dialog.alert('SidePanel已关闭');
		}
	}
});
```

## SidePanel.showPage(url[, title[, options]])
在sidePanel中以iframe的形式显示出来url页面。参数：
* url
	* 类型：String
	* 详细：要显示的页面地址
* title
	* 类型：String
	* 详细：sidepanel的标题
* options
	* 类型：Object
	* 详细：配置参数。目前支持的参数有：
		* title，String，sidePanel的标题
		* listeners，Object，一些SidePanel支持的事件
			* show，当SidePanel出现后触发
			* beforehide，当SidePanel隐藏前触发。注意，此时SidePanel内的demo结构还没有销毁；如果处理函数返回false，则不会关闭SidePanel
			* hide，当SidePanel隐藏后触发。注意，此时SidePanel内的dom已被销毁

```javascript
//显示一个不带标题的面板
SidePanel.showPage('https://www.wandougongzhu.cn');
//显示一个带标题的面板
SidePanel.show('https://www.wandougongzhu.cn', 'demo的标题');
//显示一个带村题的面板，在关闭前随机一个数，如果这个数大于0.5，就阻止关闭动作
SidePanel.show('https://www.wandougongzhu.cn', {
	title: 'demo标题也可以写在这里',
	listeners: {
		beforehide(){
			if(Math.random()>0.5){
				return false;
			}
		}
	}
});
//显示一个不带标题的面板，关闭后显示一个提示
SidePanel.show('https://www.wandougongzhu.cn', 'demo的标题', {
	listeners: {
		hide(){
			Dialog.alert('SidePanel已关闭');
		}
	}
});
```
## SidePanel.hide()
隐藏SidePanel

## 参考
* [demo](/resource/html/demo.html?demo=SidePanel)