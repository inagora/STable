require('./qtip.css');
let qtipBox, manualList=[];
function show(type, msg, duration, onclose){
	if(!qtipBox) {
		qtipBox = document.createElement('div');
		qtipBox.className = 'st-qtip-box';
		document.body.appendChild(qtipBox);
	}
	if(typeof duration=='function'){
		onclose = duration;
		duration = 3;
	}
	if(typeof duration=='undefined')
		duration = 3;
	let icon = {
		success: 'st-icon-check-circle-fill',
		error: 'st-icon-close-circle-fill',
		info: 'st-icon-info-circle-fill',
		warning: 'st-icon-warning-circle-fill',
		warn: 'st-icon-warning-circle-fill',
		loading: 'st-icon-sync'
	};
	let typeCls = {
		success: 'st-qtip-success',
		error: 'st-qtip-error',
		info: 'st-qtip-info',
		warning: 'st-qtip-warning',
		warn: 'st-qtip-warn',
		loading: 'st-qtip-loading'
	};
	let el = document.createElement('div');
	el.className = `st-qtip ${typeCls[type]}`;
	el.innerHTML = `
		<div class="st-qtip-body">
			<i class="st-qtip-icon st-iconfont ${icon[type]}"></i>
			<span>${msg||''}</span>
		</div>
	`;
	qtipBox.appendChild(el);
	return new Promise((resolve)=>{
		setTimeout(function(){
			el.classList.add('st-qtip-visible');
			if(duration){
				setTimeout(function(){
					el.classList.remove('st-qtip-visible');
				}, duration*1000);
				// eslint-disable-next-line no-inner-declarations
				function r(){
					if(!el.classList.contains('st-qtip-visible')){
						el.removeEventListener('transitionend', r, false);
						el.remove();
						if(onclose && typeof onclose=='function')
							onclose();
						resolve();
					}
				}
				el.addEventListener('transitionend', r, false);
			} else {
				manualList.push({el, resolve, onclose});
			}
		}, 0);
	});
}
export default {
	show,
	destroy(){
		manualList.forEach(item=>{
			let el=item.el, resolve=item.resolve, onclose=item.onclose;
			el.classList.remove('st-qtip-visible');
			function r(){
				if(!el.classList.contains('st-qtip-visible')){
					el.removeEventListener('transitionend', r, false);
					el.remove();
					if(onclose && typeof onclose=='function')
						onclose();
					resolve();
				}
			}
			el.addEventListener('transitionend', r, false);
		});
		manualList = [];
	},
	info(msg, duration, onclose){
		return show('info', msg, duration, onclose);
	},
	success(msg, duration, onclose){
		return show('success', msg, duration, onclose);
	},
	error(msg, duration, onclose){
		return show('error', msg, duration, onclose);
	},
	warn(msg, duration, onclose){
		return show('warn', msg, duration, onclose);
	},
	warning(msg, duration, onclose){
		return show('warn', msg, duration, onclose);
	},
	loading(msg, duration, onclose){
		return show('loading', msg, duration, onclose);
	}
};