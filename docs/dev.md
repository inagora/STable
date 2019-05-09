# 开发和编译 {#compile}
---
对STable功能添加和修改，是一个常见的事儿。一个正常的开发流程是：
1. 新增一个git分支；
2. 在分支开开发代码、测试；
3. 修改doc下的文档
4. 执行编译，生成生产环境文件，STable.min.js和STable.full.min.js
5. 增加或修改web下的demo例子
6. 分支合并到主干
7. release一个新的版本，然后就可以通过jsdeliver来使用文件了。

#### 辅助工具
在package.json中配置了两个script命令：
```shell
# 打开开发环境
npm run dev
# 编译生成生产环境文件
npm run build
```
`npm run dev`命令会用koajs开启一个web服务，然后自动调起浏览器，打开开发页面http://localhost:3000/resource/html/dev.html。
这个页面中使用的STable.min.css和STable.min.css是用webpack的HMR模块热替换功能，动态编译源码提供的，对源码的修改会实时自动反馈在网页上。

功能开发完后，要生成线上使用代码，执行`npm run build`就行了。它会在/dist目录下成生成
* STable.full.min.js，包括STable、Vue、element-ui的打包文件
* STable.full.min.css，包括STable、element-ui、FontAwesome的打包文件
* STable.min.js，STable的js文件，不包含任何依赖
* STable.min.css，STable的css文件，不包任何含依赖

四个文件。

代码从分支合并到主干后，就可以在github上操作release一个新的版本。版本号以v开始，分为三级，如 v1.3.5，分别为主版本号、大功能版本号、小功能版本号。release之后，就可以通过jsdeliver获取到dist下的文件。比如

```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/gh/inagora/STable@v1.0.5.3/dist/STable.full.min.css"/>
<script src="//cdn.jsdelivr.net/gh/inagora/STable@v1.0.5.3/dist/STable.full.min.js"></script>
```