require('./Progressbar.css');
export default class Progressbar{
	constructor({type='normal', duration=5000, text=''}){
		let dom = document.createElement('div');
		dom.className = 'st-pb-box';
		dom.innerHTML = '<div class="st-pb-body"><progress class="st-pb" value="0" max="100"></progress><div class="st-pb-tip"></div></div>';
		document.body.appendChild(dom);
		this.dom = dom;

		if(type=='infinite') {
			this.duration = duration;
			this.val = 0;
			this.loop();
		}
		this.update(null, text);
	}
	update(value, text){
		if(value != null){
			let val = value*100;
			this.dom.querySelector('.st-pb').value = val;
		}
		if(text!=null)
			this.dom.querySelector('.st-pb-tip').innerHTML = text;
	}
	destroy(){
		this.dom.remove();
		if(this.timerId) {
			clearTimeout(this.timerId);
			this.timerId = null;
		}
	}
	loop(){
		this.val++;
		if(this.val>100)
			this.val = 0;
		this.dom.querySelector('.st-pb').value = this.val;
		this.timerId = setTimeout(()=>{
			this.loop();
		}, this.duration/100);
	}
}