function f1(){
	SidePanel.show('这是一个简单的demo');
}
function f2(){
	let content = document.querySelector('#pop').innerHTML;
	SidePanel.show(content, 'demo的标题');
}
function f3(){
	SidePanel.showPage('https://m.wandougongzhu.cn', '豌豆公主');
}
function f4(){
	SidePanel.showPage('https://m.wandougongzhu.cn', {
		listeners: {
			beforehide(){
				if(Math.random()>0.5){
					Dialog.alert('不允许关闭SidePanel');
					return false;
				}
			}
		}
	});
}