# 打造你的第一个STable应用
本章会一步步从零搭建一个使用STable的页面。使用STable可以通过简单的配置展示列表数据，通过一些高级配置项可以让页面内容更加丰富。STable提供了一些高级的API，可以灵活的配置页面。

下面跟着文档打造你的第一个STable页面。
## 安装STable
在上一个章节中已详细介绍了STable的[安装方式](install.html#直接使用-script-引入)。
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/inagora/STable@v1.4.2/dist/STable.min.css"/>
    <title>fixed</title>
</head>
<body>
    <div class="body">
        <div id="box"></div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/inagora/STable@v1.4.2/dist/STable.min.js"></script>
</body>
</html>
```
## 配置列
表格中的数据展示主要是通过列的配置实现的，包括要显示的表头、每一列的数据等。  
列的数据可以通过异步请求获取或者渲染静态化的数据。  
如果异步获取数据则需要配置url参数，STable会把接口返回的数据自动填充到对应的列下面；如果要渲染静态化数据则需要配置records属性；
* 异步请求获取数据
```javascript
<script>
STable.init({
    el: '#box',
    url: '/ajaxWaterfall',
    columns: [
        'name',
        'movieType',
        {
            dataIndex: 'actors',
            text: 'actors'
        }
    ]
});
</script>
```
* __参考__:
	* <DemoViewer demo="api-columns" />  

* 静态化数据
```javascript
<script>
STable.init({
    el: '#box',
    columns: [
        'name',
        'movieType',
        {
            dataIndex: 'actors',
            text: 'actors'
        }
    ],
    records: [
        {
            id: 1,
            name: '鳄鱼',
            movieType: '记录片',
            year: '2010'
        },
        {
            id: 2,
            name: '终结者2018',
            movieType: '科幻',
            year: '2018'
        }
    ]
});
</script>
```
* __参考__:
	* <DemoViewer demo="api-records" />  

如果需要对某一列进行操作，可以配置一个操作列，该列包含一些操作的按钮。  
每一个buttons项可以设置visible属性，满足针对某些列显示特定的按钮；  
通过width属性可以设置某一列的宽度，并且支持flex；  
```javascript
<script>
STable.init({
    el: '#box',
    url: '/ajaxWaterfall',
    columns: [
        'name',
        'movieType',
        {
            dataIndex: 'actors',
            text: 'actors',
            width: 200
        },
        {
            buttons: [
                {
                    text: '删除',
                    type: 'danger',
                    visible(record){
                        return parseInt(record.year||0)>2012;
                    },
                    click(records){
                        //delete this record
                    }
                },
                {
                    text: '提交',
                    type: 'primary',
                    click(){
                        //submit this record
                    }
                }
            ]
        }
    ]
});
</script>
```
* __参考__:
	* <DemoViewer demo="column-flex" />
有时我们需要在某一列显示特殊的样式，比如图片，这时就需要用到render函数，在render函数中可以自定义改列的样式。
```javascript
<script>
STable.init({
    el: '#box',
    url: '/ajaxWaterfall',
    columns: [
        'name',
        'movieType',
        {
            dataIndex: 'actors',
            text: 'actors',
            width: 200
        },
        {
            dataIndex: 'url',
            render(record){
                return `<img class="avatar" src="${record.url}" />`;
            }
        },
        {
            buttons: [
                {
                    text: '删除',
                    type: 'danger',
                    visible(record){
                        return parseInt(record.year||0)>2012;
                    },
                    click(records){
                        //delete this record
                    }
                },
                {
                    text: '提交',
                    type: 'primary',
                    click(){
                        //submit this record
                    }
                }
            ]
        }
    ]
});
</script>
```
* __参考__:
	* <DemoViewer demo="first-stable" />
至此，一个基本的STable页面就可以完美的呈现在你的屏幕上了。