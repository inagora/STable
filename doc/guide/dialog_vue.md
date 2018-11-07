
# Dialog中使用Vue开发
使用Dialog时，经常涉及到对窗口中的内容做一些处理，比如获取表单的内容等。为了方便处理，dialog支持直接配置Vue参数。
## 简单入门
我们以一个简单的电影列表为例，可以查看每个电影的海报。先去看看demo[:point_right:'Dialog中使用Vue - 1'](/resource/html/demo.html?demo=dialog)。接下来，我们一步步实现它。

首先，声明一个dialog要用的模板。
::: tip
一般我们会把模板放到script标签里，即不渲染，又可以通过dom方法取到内容字符串
:::
```html
<script type="text/html" id="tmpl-1">
	<table>
		<tr v-for="item of list">
			<td v-text="item.name"></td>
			<td><button @click="showPoster(item)">查看海报</button></td>
		</tr>
	</table>
</script>
```
我们可以用`document.getElementById('tmpl-1').innerHTML`获得上面模板中的内容。

接着我们来配置dialog参数
```javascript
Dialog.create({
	title: 'dialog中使用Vue - 1',
	html: document.getElementById('tmpl-1').innerHTML,
	//以下为vue的配置
	data: {
		list: [
			{name:'音乐脚步', poster: 'https://img5.mtime.cn/mt/2017/08/31/102049.88433138_640X360X2.jpg'},
			{name: '幸福路上', poster:'https://img5.mtime.cn/mt/2017/11/19/161729.30043136_640X360X2.jpg'}
		]
	},
	methods: {
		showPoster(movie){
			Dialog.create({
				html: `<img src="${movie.poster}">`
			});
		}
	}
});
```
上例中参数`html`就是我们之前定义的模板字符串，`data`、`methods`就是Vue的配置参数。所有的vue参数在这里都可以使用。
> 当然el参数就不用配了，因为它就在dialog中，不需要容器。

如此简单，看看效果吧：[:point_right:'Dialog中使用Vue - 1'](/resource/html/demo.html?demo=dialog)

## dialog中使用Form表单

::: tip
注意，这里有一个小技巧，我们给提交按钮指了一个form属性和一个nativeType为'submit'的属性。这就让它成了表单testForm的提交按钮，点击它直接触发表单testForm的submit事件。
:::

## 搭配 element-ui
## 搭配 STable
## 不使用Vue，纯手工