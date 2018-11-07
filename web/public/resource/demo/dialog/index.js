function qtip1(){
	Dialog.qtip('这里是一个快速提示');
}
function qtip2(){
	Dialog.qtip('这里是一个快速提示', 'error');
}
function qtip3(){
	Dialog.qtip('这里是一个快速提示', {
		type: 'error',
		duration: 1000
	});
}

function fun1(){
	Dialog.alert('这是一个alert');
}
function fun2(){
	Dialog.alert('这是一个带回调的alert', '带回调的提示', {
		fn(){
			alert('您关闭了这个提示');
		}
	})
}
function fun3(){
	Dialog.confirm('随便点个按钮',{
		fn(ret){
			alert('您选择的结果是：'+ret);
		}
	});
}
function fun4(){
	Dialog.prompt('输入啥都行：',{
		fn(ret){
			alert('您刚才的输入内容是：'+ret);
		}
	})
}

function dia1(){
	Dialog.create({
		title: '这是一个窗口',
		width: 800,
		height: '60%',
		html: '<h1>标题</h1><div>这里是窗口的内容</div>',
		listeners:{
			ready(){
				console.log('窗口初始化完毕');
			},
			close(){
				console.log('窗口已经关闭了');
			}
		},
		buttons: [{
			text: '确定',
			icon: 'el-icon-bell',
			click(){
				alert('确定');
			}
		},{
			text: '关闭',
			type: 'danger',
			click(){
				this.close();
			}
		}]
	});
}
function diaVue1() {
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
}
function dia2(){
	Dialog.create({
		title: '一个带vue的示例',
		width: '60%',
		height: '60%',
		buttons:[{
			text: '提交',
			nativeType: 'submit',
			form: 'testForm'
		}],
		html: document.getElementById('tmpl').innerHTML,

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
}