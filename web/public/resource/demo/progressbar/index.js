function normalPb(){
	let pb = Progressbar.create({
		text: '当前进度0%'
	});
	let i=0;
	let timerId = setInterval(function(){
		i++;
		let value = i/10;
		pb.update(value, `当前进度${value*100}%`);
		if(value>=1) {
			clearInterval(timerId);
			setTimeout(function(){
				pb.destroy();
			}, 500);
		}
	}, 1000);
}

function infinitePb() {
	let pb = Progressbar.create({
		text: '任务执行中，请耐心等待...',
		type: 'infinite'
	});
	setTimeout(function(){
		pb.update(0, '任务已经跑了一段时间了，不要放弃');
	},5000);
	setTimeout(function(){
		Dialog.alert('任务执行结束!');
		pb.destroy();
	},25000);
}