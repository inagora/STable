window.addEventListener('message',evt=>{
	if(evt.origin == window.location.origin
		&& typeof evt.data.js!='undefined'
		&& typeof evt.data.css!='undefined'
		&& typeof evt.data.html!='undefined') {
		
		let style = document.createElement('style');
		style.type = "text/css";
		style.appendChild(document.createTextNode(evt.data.css));
		document.head.appendChild(style);

		let html = document.createElement('div');
		html.innerHTML = evt.data.html;
		document.body.appendChild(html);

			
		let script = document.createElement('script');
		script.type = 'text/javascript';
		script.text = '(function(){'+evt.data.js+'})()';
		document.body.appendChild(script);
	}
}, false);
window.parent.postMessage('playground-ready', window.location.origin);