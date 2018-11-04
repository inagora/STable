
# Dialog与Vue的配合使用
使用Dialog时，经常涉及到对窗口中的内容做一些处理，获取表单的内容等。为了方便处理，dialog支持做为一个vue实例使用。config参数中，除了上面说明的参数外，还支持vue的所有配置参数，它些配置参数，用于对窗口内的html生成一个vue实例。
```html
<script type="text/html" id="tmpl">
	<form id="testForm" @submit.prevent="submit">
		<table>
			<tr>
				<td>电影名</td>
				<td>
					<input name="movieName" v-model="movie.name" />
				</td>
			</tr>
			<tr>
				<td>发行时间</td>
				<td>
					<select name="year" v-model="movie.year">
						<option value="2017">2017</option>
						<option value="2018">2018</option>
						<option value="2019">2019</option>
					</select>
				</td>
			</tr>
		</table>
	</form>
</script>
```
```javascript
let dia = Dialog.create({
	title: '一个带vue的示例',
	width: '60%',
	height: '60%',
	buttons:[{
		text: '提交',
		nativeType: 'submit',
		form: 'testForm'
	}],
	html: document.getElementById('tmpl').innerHTML,
	//以下为vue的配置
	data: {
		movie: {
			name: '豌豆公主第一季',
			year: '2018'
		}
	},
	methods: {
		submit(){
			Dialog.alert('结果是：'+JSON.stringify(this.movie));
		}
	}
});
```
上面例子中，dialog内是一个vue实例，它展示了一个demo，当点击提交按钮时，直接通过this.movie拿到form表单的数据，可以进行处理了。

> 注意，这里有一个小技巧，我们给提交按钮指了一个form属性和一个nativeType为'submit'的属性。这就让它成了表单testForm的提交按钮，点击它直接触发表单testForm的submit事件。