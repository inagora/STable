(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{146:function(t,e,i){"use strict";i.r(e);var s=i(0),r=Object(s.a)({},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"content"},[t._m(0),t._v(" "),i("p",[t._v("STable的使用，大部分时间都是在和各种配置参数打交道。")]),t._v(" "),i("p",[t._v("因为STable有过多次升级，有些参数的名字和格式发生了变化。鉴于对以往版本的兼容，参数尽量不变。如果有变化的，我们会标记出来。大致有两类：")]),t._v(" "),t._m(1),t._v(" "),t._m(2),t._v(" "),t._m(3),t._v(" "),t._m(4),t._m(5),t._v(" "),t._m(6),t._v(" "),t._m(7),t._v(" "),t._m(8),t._v(" "),t._m(9),t._v(" "),t._m(10),t._v(" "),t._m(11),t._v(" "),t._m(12),t._v(" "),t._m(13),t._v(" "),t._m(14),t._v(" "),t._m(15),t._v(" "),t._m(16),t._v(" "),t._m(17),t._v(" "),t._m(18),t._v(" "),i("ul",[i("li",[t._v("类型：Array")]),t._v(" "),i("li",[t._v("详细：\n添加或编辑行数据record时，弹窗中表单项的详细设置。")]),t._v(" "),i("li",[t._v("参考：\n"),i("ul",[t._m(19),t._v(" "),i("li",[i("router-link",{attrs:{to:"./form_config.html"}},[t._v("表单项配置")])],1)])])]),t._v(" "),t._m(20),t._v(" "),t._m(21),t._v(" "),t._m(22),t._v(" "),t._m(23),t._v(" "),t._m(24),t._v(" "),t._m(25),t._v(" "),t._m(26),t._v(" "),t._m(27),t._v(" "),t._m(28),t._v(" "),t._m(29),t._v(" "),t._m(30),t._v(" "),t._m(31),t._v(" "),t._m(32),t._v(" "),t._m(33),t._v(" "),t._m(34),i("p",[t._v("让每页请求100条数据，而不是默20条。")]),t._v(" "),t._m(35),t._v(" "),t._m(36),t._v(" "),t._m(37),t._v(" "),i("ul",[i("li",[t._v("类型：array")]),t._v(" "),i("li",[t._v("详细：\n搜索区域的配置。因为搜索区域本质上是一个form表单，搜索的配置是表单每一顶的配置")]),t._v(" "),i("li",[t._v("参考\n"),i("ul",[i("li",[i("router-link",{attrs:{to:"./form_config.html"}},[t._v("表单配置")])],1)])])]),t._v(" "),t._m(38),t._v(" "),t._m(39),t._v(" "),t._m(40),t._v(" "),t._m(41),t._v(" "),t._m(42),t._v(" "),t._m(43),t._v(" "),t._m(44),t._v(" "),t._m(45),t._v(" "),t._m(46),t._v(" "),i("ul",[i("li",[t._v("类型：Array")]),t._v(" "),i("li",[t._v("详细：\n表格顶部的工具栏，它的每一项就是一个按钮配置。")]),t._v(" "),i("li",[t._v("参考：\n"),i("ul",[i("li",[i("router-link",{attrs:{to:"./button_config.html"}},[t._v("按钮配置")])],1)])])]),t._v(" "),t._m(47),t._v(" "),i("ul",[i("li",[t._v("类型：String")]),t._v(" "),i("li",[t._v("详细：\n修改行数据时的提交地址。如果有此参数，会在每一行的最后添加一列，此列中有一个“修改”按钮，点此按钮，会修改此行。")]),t._v(" "),i("li",[t._v("参考：\n"),i("ul",[i("li",[i("a",{attrs:{href:"https://doc.wfxteam.com/demo/edit",target:"_blank",rel:"noopener noreferrer"}},[t._v("crud操作"),i("OutboundLink")],1)]),t._v(" "),t._m(48)])])]),t._v(" "),t._m(49),t._v(" "),t._m(50)])},[function(){var t=this.$createElement,e=this._self._c||t;return e("h1",{attrs:{id:"stable配置"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#stable配置","aria-hidden":"true"}},[this._v("#")]),this._v(" STable配置")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("不推荐使用的(deprecation)，我们以"),e("sup",{staticStyle:{color:"red"}},[this._v("dep")]),this._v("标识")]),this._v(" "),e("li",[this._v("有调整的(modify)，我们以"),e("sup",{staticStyle:{color:"green"}},[this._v("mod")]),this._v("标识")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"actionmethods"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#actionmethods","aria-hidden":"true"}},[this._v("#")]),this._v(" actionMethods")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("类型：Object")]),this._v(" "),e("li",[this._v("默认值：")])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"language-javascript extra-class"},[i("pre",{pre:!0,attrs:{class:"language-javascript"}},[i("code",[i("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\tcreate"),i("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),i("span",{attrs:{class:"token string"}},[t._v("'POST'")]),i("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\tread"),i("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),i("span",{attrs:{class:"token string"}},[t._v("'GET'")]),i("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\tupdate"),i("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),i("span",{attrs:{class:"token string"}},[t._v("'POST'")]),i("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\tdestroy"),i("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),i("span",{attrs:{class:"token string"}},[t._v("'POST'")]),t._v("\n"),i("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("详细：不同请求所使用的请求方法，包括列表、添加、修改、删除。")]),this._v(" "),e("li",[this._v("参考：\n"),e("ul",[e("li",[e("a",{attrs:{href:"/demo/edit"}},[this._v("crud操作")])])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"addurl"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#addurl","aria-hidden":"true"}},[this._v("#")]),this._v(" addUrl")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("ul",[i("li",[t._v("类型：String")]),t._v(" "),i("li",[t._v("详细：\n添加数据时的提交地址。如果有此参数，会在工具栏toolbar自动显示一个“添加”按钮。")]),t._v(" "),i("li",[t._v("参考：\n"),i("ul",[i("li",[i("a",{attrs:{href:"/demo/edit"}},[t._v("crud操作")])]),t._v(" "),i("li",[i("a",{attrs:{href:"#action-methods"}},[t._v("请求方法 actionMethods")])])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"batdeleteurl"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#batdeleteurl","aria-hidden":"true"}},[this._v("#")]),this._v(" batDeleteUrl")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("ul",[i("li",[t._v("类型：String")]),t._v(" "),i("li",[t._v("详细：\n批量删除数据时的提交地址。如果有此参数，会在工具栏toolbar自动显示一个“删除”按钮，点此按钮，会把所有选中行删除。需要配合参数selectMode使用。")]),t._v(" "),i("li",[t._v("参考\n"),i("ul",[i("li",[i("a",{attrs:{href:"/demo/edit"}},[t._v("crud操作")])]),t._v(" "),i("li",[i("a",{attrs:{href:"#select-mode"}},[t._v("行选择模式 selectMode")])])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"columns"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#columns","aria-hidden":"true"}},[this._v("#")]),this._v(" columns")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("类型：Array")]),this._v(" "),e("li",[this._v("详细：\n列配置。数据中的每一项对应表格中的一列，通过它配置此列的表头、表格内容以及展示样式。")]),this._v(" "),e("li",[this._v("参考:\n"),e("ul",[e("li",[e("a",{attrs:{href:"#column-config"}},[this._v("column配置")])])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"deleteurl"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#deleteurl","aria-hidden":"true"}},[this._v("#")]),this._v(" deleteUrl")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("类型：String")]),this._v(" "),e("li",[this._v("详细：\n删除数据时的提交地址。如果有此参数，会在每一行的最后添加一列，此列中有一个“删除”按钮，点此按钮，会删除此行。")]),this._v(" "),e("li",[this._v("参考：\n"),e("ul",[e("li",[e("a",{attrs:{href:"/demo/edit"}},[this._v("crud操作")])])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"downloadable"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#downloadable","aria-hidden":"true"}},[this._v("#")]),this._v(" downloadable")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("ul",[i("li",[t._v("类型：Boolean|String")]),t._v(" "),i("li",[t._v("默认值：false")]),t._v(" "),i("li",[t._v("详细：\n此参数的可选值有以下四种：\n"),i("ul",[i("li",[t._v("true，在工具栏toolbar同时显示“导出当前页”和“导出所有页”两个按钮")]),t._v(" "),i("li",[t._v("false，不会显示下载按钮")]),t._v(" "),i("li",[t._v("'single'，只显示“导出当前页”按钮")]),t._v(" "),i("li",[t._v("'all'，只显示“导出所有页”按钮")])])]),t._v(" "),i("li",[t._v("参考：\n"),i("ul",[i("li",[i("a",{attrs:{href:"/demo/download"}},[t._v("download")])])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"downloadtimeout"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#downloadtimeout","aria-hidden":"true"}},[this._v("#")]),this._v(" downloadTimeout")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("类型：Number")]),this._v(" "),e("li",[this._v("默认值：10000")]),this._v(" "),e("li",[this._v("详细：\n毫秒数。全量下载所有数据时，会分页面请求数据，可以用此参数指定每个页面请求的超时时间。如果超时，会中断请求，重新发起一个。有些请求耗时很长时，请指定一个比较大的时间。")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"editconfig"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#editconfig","aria-hidden":"true"}},[this._v("#")]),this._v(" editConfig")])},function(){var t=this.$createElement,e=this._self._c||t;return e("li",[e("a",{attrs:{href:"/demo/edit"}},[this._v("crud操作")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"el"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#el","aria-hidden":"true"}},[this._v("#")]),this._v(" el")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("类型：String|Dom")]),this._v(" "),e("li",[this._v("默认值：'#wdStableContainer'")]),this._v(" "),e("li",[this._v("详细：\nel指定STable在页面中的dom容器，它可以是css选择器，也可是一个dom。")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("blockquote",[e("p",[this._v("STable4、5中，因为与页面框架的配合，STable初始化时大部分情况下不需要指定这个参数。")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"idindex"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#idindex","aria-hidden":"true"}},[this._v("#")]),this._v(" idIndex")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("类型：String")]),this._v(" "),e("li",[this._v("详细：\ncrud操作中，修改或者删除行时，由此参数来唯一标识行数据，并发给服务端。")]),this._v(" "),e("li",[this._v("参考：\n"),e("ul",[e("li",[e("a",{attrs:{href:"/demo/edit"}},[this._v("crud操作")])])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"labelvisible"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#labelvisible","aria-hidden":"true"}},[this._v("#")]),this._v(" labelVisible")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("ul",[i("li",[t._v("类型：Boolean")]),t._v(" "),i("li",[t._v("默认值：true")]),t._v(" "),i("li",[t._v("详细：\n搜索过滤项的名字标签是否显示。当搜索项太多时，把此参数设为false，可以让搜索区显得更为紧凑。")]),t._v(" "),i("li",[t._v("参考：\n"),i("ul",[i("li",[i("a",{attrs:{href:"/demo/search"}},[t._v("搜索")])])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"listeners"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#listeners","aria-hidden":"true"}},[this._v("#")]),this._v(" listeners")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("ul",[i("li",[t._v("类型：Object")]),t._v(" "),i("li",[t._v("详细：\nSTable会一些时机，触发一些钩子函数，通过事件的方式对外暴露，可以在这些事件触发时，用户做一些处理。有以下事件：\n"),i("ul",[i("li",[i("p",[t._v("ready")]),t._v(" "),i("ul",[i("li",[t._v("详细：\n在STable初始化之后就调用，适合作一些准备工作，如事件绑定、数据准备，类似于浏览器的domready")])])]),t._v(" "),i("li",[i("p",[t._v("refresh")]),t._v(" "),i("ul",[i("li",[t._v("参数：\n"),i("ul",[i("li",[t._v("list，数组，当前页面的数据")])])]),t._v(" "),i("li",[t._v("详细：\n加载完新一页数据后触发")])])]),t._v(" "),i("li",[i("p",[t._v("afteradd")]),t._v(" "),i("ul",[i("li",[t._v("参数：\n"),i("ul",[i("li",[t._v("res，添加之后，服务端返回的结果")])])]),t._v(" "),i("li",[t._v("详细：\n添加一行数据之后触发。")])])]),t._v(" "),i("li",[i("p",[t._v("afteredit")]),t._v(" "),i("ul",[i("li",[t._v("参数：\n"),i("ul",[i("li",[t._v("rowData，修改前的行数据")]),t._v(" "),i("li",[t._v("res，修改之后服务端返回的数据")])])]),t._v(" "),i("li",[t._v("详细：\n修改一行数据后触发")])])]),t._v(" "),i("li",[i("p",[t._v("search")]),t._v(" "),i("ul",[i("li",[t._v("参数\n"),i("ul",[i("li",[t._v("search，搜索使用的参数")])])]),t._v(" "),i("li",[t._v("详细\n搜索时触发")])]),t._v(" "),i("blockquote",[i("p",[t._v("注意，如果search的触发函数中明确返回了false结果，就会阻止本次搜索的发出")])])])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"page"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#page","aria-hidden":"true"}},[this._v("#")]),this._v(" page")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("类型：Number")]),this._v(" "),e("li",[this._v("默认值：1")]),this._v(" "),e("li",[this._v("详细：\n初始加载的页号。")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("blockquote",[e("p",[this._v("注意，页号从1开始。")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"params"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#params","aria-hidden":"true"}},[this._v("#")]),this._v(" params")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("类型：object")]),this._v(" "),e("li",[this._v("详细：\n从服务端拉取每页表格数据时，params中的值也会当做参数一起发送过去。使用这个字段，可以让开发者自定义一些参数，发给列表接口。比如，可以设置")])])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"language-json extra-class"},[i("pre",{pre:!0,attrs:{class:"language-json"}},[i("code",[t._v("postData"),i("span",{attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),i("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),i("span",{attrs:{class:"token property"}},[t._v('"count"')]),i("span",{attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),i("span",{attrs:{class:"token number"}},[t._v("100")]),t._v("\n"),i("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"rownumbervisible"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#rownumbervisible","aria-hidden":"true"}},[this._v("#")]),this._v(" rowNumberVisible")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("类型：Boolean")]),this._v(" "),e("li",[this._v("默认值：false")]),this._v(" "),e("li",[this._v("详细：\n是否在行首显示行号。")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"searchfilter"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#searchfilter","aria-hidden":"true"}},[this._v("#")]),this._v(" searchFilter")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"selectmode"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#selectmode","aria-hidden":"true"}},[this._v("#")]),this._v(" selectMode")])},function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("ul",[i("li",[t._v("类型：string")]),t._v(" "),i("li",[t._v("默认值：'none'")]),t._v(" "),i("li",[t._v("详细：\n表格的选择模式。在单选框或复选框选择行之后，可以通过app的getSelectedRows接口获取所有选中的行。有以下三种模式：\n"),i("ul",[i("li",[t._v("'none'，在表格行前面不显示选择按钮")]),t._v(" "),i("li",[t._v("'single'，单选模式，在表格行前显示单选按钮")]),t._v(" "),i("li",[t._v("'multiple'，多选模式，在表格行前显示多选按钮")])])])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"sortkey"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#sortkey","aria-hidden":"true"}},[this._v("#")]),this._v(" sortKey")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("类型：String")]),this._v(" "),e("li",[this._v("详细：\n默认按哪个值排序，它决定请求页数据时，sort_key字段的值。")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"sortdirection"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#sortdirection","aria-hidden":"true"}},[this._v("#")]),this._v(" sortDirection")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("类型：String")]),this._v(" "),e("li",[this._v("默认值：'asc'")]),this._v(" "),e("li",[this._v("详细\n默认排序方向")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"title"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#title","aria-hidden":"true"}},[this._v("#")]),this._v(" title")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("类型：String")]),this._v(" "),e("li",[this._v("详细：\n标题。它也会用作下载时的默认文件标题。")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"toolbar"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#toolbar","aria-hidden":"true"}},[this._v("#")]),this._v(" toolbar")])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"updateurl"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#updateurl","aria-hidden":"true"}},[this._v("#")]),this._v(" updateUrl")])},function(){var t=this.$createElement,e=this._self._c||t;return e("li",[e("a",{attrs:{href:"#action-methods"}},[this._v("请求方法 actionMethods")])])},function(){var t=this.$createElement,e=this._self._c||t;return e("h2",{attrs:{id:"url"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#url","aria-hidden":"true"}},[this._v("#")]),this._v(" url")])},function(){var t=this.$createElement,e=this._self._c||t;return e("ul",[e("li",[this._v("类型：String")]),this._v(" "),e("li",[this._v("详细：\n请求每页数据的异步接口。")]),this._v(" "),e("li",[this._v("参考：\n"),e("ul",[e("li",[e("a",{attrs:{href:"#action-methods"}},[this._v("请求方法 actionMethods")])])])])])}],!1,null,null,null);r.options.__file="README.md";e.default=r.exports}}]);