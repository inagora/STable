# 进度条使用
## 普通进度条
处理批量任务或耗时比较长任务时，我们经常需要展示一个进度条给用户。STable做了一个简单的进度条，效果如下：

![进度条](../img/progressbar.jpg)

要使用进度条，需要先创建一个：
```javascript
let pb = Progressbar.create();
```
然后在进度有变化时，更新它就行了。
```
pb.update(0.2, '已完成2个任务，共有10个');
```
update有两个参数，第一个是[0, 1]之间的一个小数，表示当前的进度。比如0.55，就是进度55%。第二个是在进度条上显示的文案。

所有任务完成之后，就可以调用关闭或者销毁接口。
```javascript
pb.close(); //隐藏进度条
//或者直接销毁它
pb.destroy();
```

## 无限进度条
有时候，我们并不知道总共有多少任务，或者总耗时不明确。这时可以用进度条的`无限模式`。

打开一个无限模式的进度条
```javascript
let pb = Progressbar.create({ type: 'infinite' });
```
就会显示一个进度无限循环的进度条。

## 参考
* [Progressbar Api](../config/progressbar.md)
* [demo](/resource/html/demo.html?demo=progressbar)