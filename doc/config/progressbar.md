# 进度条
## Progressbar.create([options])
创建一个进度条。比如：
```javascript
let pb = Progressbar.create({
	value: 0.4,
	text: '当前进度40%'
});
创建了一个默认进度是40%的进度条。
```
它支持的参数：
* autoShow
	* 类型：Boolean
	* 默认值：true
	* 详细：创建进度条之后马上显示出来
* value
	* 类型：Number
	* 默认值：0
	* 详细：初始化时进度条的进度值。它是一个[0, 1]之间的小数
* text
	* 类型：String
	* 默认值：''
	* 详细：进度条上显示的描述文案
* type
	* 类型：String
	* 默认值：'normal'
	* 详细：进度条类型。目前只有'normal'、'infinite'两个值可选

Progressbar的实例方法有下面几个，以便更新和操作进度条。
## pb.show()
让进度条显示出来
## pb.hide()
把进度条隐藏起来
## pb.destroy()
把进度条销毁。与pb.hide不同，hide之后还可以通过show方法，把进度条显示出来继续使用；destroy之后进度条dom就不存在了，无法继续使用了。
## pb.update(value, text)
更新进度条的进度值和进度条上显示的文字。
* value
	* 类型：Number
	* 详细：一个[0, 1]之间的小数
* text
	* 类型：String
	* 详细：进度条上要显示的文字

## 参考
* [Progressbar使用文档](../guide/progressbar.md)
* [demo](/resource/html/demo.html?demo=progressbar)