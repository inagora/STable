export function loadScript(src) {
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = src;
	document.head.appendChild(script);
}

export function hashCode(str) {
	let ret = str.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;},0);
	return ret.toString(16);
}

//export let isSafari = window.navigator.vendor.toLowerCase().includes('apple computer');