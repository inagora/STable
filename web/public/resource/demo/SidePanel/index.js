function sidePanel1(){
	let content = document.querySelector('#pop').innerHTML;
	SidePanel.show(content, '一个sidepanel的demo');
}

function sidePanel2(){
	SidePanel.showPage('https://m.wandougongzhu.cn', '豌豆公主');
}