require('./Progressbar.css');
export default class Progressbar{
	constructor(){
		let dom = document.createElement('div');
		dom.className = 'x-pb-box';
		dom.innerHTML = '<div class="x-pb-body"><progress class="x-pb" value="0" max="100"></progress><div class="x-pb-tip"></div></div>';
		document.body.appendChild(dom);
		this.dom = dom;
	}
	update(value, text){
		let val = value*100;
		this.dom.querySelector('.x-pb').value = val;
		this.dom.querySelector('.x-pb-tip').innerHTML = text;
	}
	destroy(){
		this.dom.remove();
	}
}