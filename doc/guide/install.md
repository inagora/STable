# 安装
## 快速使用
最简单的引入方式，直接引用cdn上两个编译好的文件就行了。
```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>demo</title>
	<!-- 引入全量css文件 -->
	<link rel="stylesheet" href="//cdn.jsdelivr.net/gh/inagora/STable@v1.2.0/dist/STable.full.min.css"/>
</head>
<body>
	<div id="app"></div>
	<!-- 引用全量js文件 -->
	<script src="//cdn.jsdelivr.net/gh/inagora/STable@v1.2.0/dist/STable.full.min.js"></script>
	<script>
		//初始化STable
		STable.init({
			el: '#app',
			//...其它配置
		});
	</script>
</body>
</html>
```
`STable.full.min.css`和`STable.full.min.js`是包含了依赖的STable文件，直接引用它们就可以用了。

::: tip
 注意：STable的容器元素el，它的高宽需要确定。也就是说，容器高宽不能依赖STable的内容撑开，因为STable会根据容器的高宽，计算每个组件的尺寸。
:::

## 使用非依赖版本
如果页面上已经引用了Vue、element-ui等依赖，就可以不用全量版本的文件，使用非依赖版本，它的体积会小很多。

文件名 | 大小 | gzip
------------ | ------------- | -------------
[STable.full.min.js](https://cdn.jsdelivr.net/gh/inagora/STable@v1.2.0/dist/STable.full.min.js) | 436K | 119K
[STable.full.min.css](https://cdn.jsdelivr.net/gh/inagora/STable@v1.2.0/dist/STable.full.min.css) | 114K | 27.4K
[STable.min.js](https://cdn.jsdelivr.net/gh/inagora/STable@v1.2.0/dist/STable.min.js) | 61K | 18.4K
[STable.min.css](https://cdn.jsdelivr.net/gh/inagora/STable@v1.2.0/dist/STable.min.css) | 13K | 3.7K

```html
<!-- 引入依赖css文件 -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/element-ui@2.4.9/lib/theme-chalk/index.css"/>
<!-- 引入STable css文件 -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/gh/inagora/STable@v1.0.8/dist/STable.min.css"/>
<!-- 引用依赖js文件 -->
<script src="//cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/element-ui@2.4.9/lib/index.js"></script>
<!-- 引用STable js文件 -->
<script src="//cdn.jsdelivr.net/gh/inagora/STable@v1.0.8/dist/STable.min.js"></script>
```