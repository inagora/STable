export function loadScript(src) {
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = src;
	document.head.appendChild(script);
}

let jses = {};
export function loadJs(url) {
	if(jses[url])
		return jses[url];
	else {
		let p = new Promise(resolve=>{
			let head = document.getElementsByTagName('head')[0] || document.documentElement,
				script = document.createElement('script');
			script.src = url;
			script.onload = script.onreadystatechange = function() {
				if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
					script.onload = script.onreadystatechange = null;
					head.removeChild(script);
					resolve();
				}
			};
			head.insertBefore(script, head.firstChild);
		});
		jses[url] = p;
		return p;
	}
}

export function hashCode(str) {
	let ret = str.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;},0);
	return ret.toString(16);
}

export function tmpl(str, data){
	return str.replace(/\$\{\s*(.+?)\s*\}/g, function(_, _$1){
		return data[_$1]||''
	});
}
//export let isSafari = window.navigator.vendor.toLowerCase().includes('apple computer');