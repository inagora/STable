# url带入参数
实际使用中，我们经常遇到想把页面url参数，做为请求的默认参数的情况。针对这个问题，STable的设计了一个解决方案：
> STable创建时，它会检测当前是不是这个页面中的第一个STable。如果是，就检测url参数中是不是有一个stable参数，并且它的值是'on'；如果是，就把剩下的url参数做为默认的请求数据参数。

比如下面这个url
```
https://www.wandougongzhu.cn/?stable=on&name=test&page=2&sort_key=id&sort_direction=asc&cat[]=10&cat[]=12
```
上面url中 `stable=on`开启了url带入参数功能。剩下的参数：
```
{
	name: 'test',
	sort_key: 'id',
	sort_direction: 'asc',
	cat: [10,12]
}
```
上面这些参数随页面数据请求一起发送。