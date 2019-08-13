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

export let isSafari = window.navigator.vendor.toLowerCase().includes('apple computer');
export let isFirefox = window.navigator.userAgent.toLowerCase().includes('firefox');

export let Console = {
	log(...args){
		window.console && window.console.log.apply(window.console, args);
	},
	warn(...args){
		window.console && window.console.warn.apply(window.console, args);
	},
	error(...args){
		window.console && window.console.error.apply(window.console, args);
	}
};