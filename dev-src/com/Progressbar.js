require('./Progressbar.css');
export default class Progressbar{
	constructor(){
		let dom = document.createElement('div');
		dom.className = 'st-pb-box';
		dom.innerHTML = '<div class="st-pb-body"><progress class="st-pb" value="0" max="100"></progress><div class="st-pb-tip"></div></div>';
		document.body.appendChild(dom);
		this.dom = dom;
	}
	update(value, text){
		let val = value*100;
		this.dom.querySelector('.st-pb').value = val;
		this.dom.querySelector('.st-pb-tip').innerHTML = text;
	}
	destroy(){
		this.dom.remove();
	}
}