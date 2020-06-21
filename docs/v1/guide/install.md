# 安装

## 更新日志
最新稳定版本：2.0.1

最新beta版本：2.0.0-beta.48
版本更新日志见[GitHub](https://github.com/inagora/STable/releases)。
## 直接使用`<script>`引入
* 下载js文件
将js文件保存到本地，[下载](https://github.com/inagora/STable/tree/master/dist)。
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>fixed</title>
</head>
<body>
    <div class="body">
        <div id="box"></div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js"></script>
    <script src="filepath/STable.min.js"></script>
</body>
</html>
```
* CDN  
通过CDN的方式引入
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/inagora/STable@v1.3.5/dist/STable.min.css"/>
    <title>fixed</title>
</head>
<body>
    <div class="body">
        <div id="box"></div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/inagora/STable@v1.3.5/dist/STable.min.js"></script>
</body>
</html>
```
## 快速上手
通过`<script>`标签引入STable后，在全局已经注册了STable，可以在js中直接使用
```javascript
<script>
STable.init({
    el: '#box',
    url: '/ajaxWaterfall',
    pageMode: 'waterfall',
    columns: [
        'name',
        'movieType',
        {
            dataIndex: 'actors',
            text: 'actors'
        }
    ],
    sublistAt: ['actors'],
    downloadable: true,
    toolbar: [
        {
            text:'hoho',
            id: 'e12',
            click(){
                console.log(this.getToolbarBtn('e12'));
            }
        }
    ]
});
</script>
```
以上介绍了STable的引入和初始化，下面一节可以打造你的第一个STable应用了。