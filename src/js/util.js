export function loadScript(src) {
	let script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = src;
	document.head.appendChild(script);
}

//export let isSafari = window.navigator.vendor.toLowerCase().includes('apple computer');