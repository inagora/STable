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
let csses = {};
export function loadCss(url){
	if(csses[url])
		return csses[url];
	else {
		let p = new Promise(resolve=>{
			let css = document.createElement( "link" );
			css.rel = "stylesheet";
			css.href = url;
			document.head.insertBefore(
				css,
				document.head.childNodes[ document.head.childNodes.length - 1 ].nextSibling
			);
			resolve();
		});
		csses[url] = p;
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

let class2type = {},
	toString = class2type.toString;
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(name => {
	class2type["[object " + name + "]"] = name.toLowerCase();
});

function $type(obj) {
	return obj == null ? String(obj) :
		class2type[toString.call(obj)] || "object";
}

function isObject(obj) {
	return $type(obj) == "object";
}

function isPlainObject(obj) {
	return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}

// let FormData = window.FormData;
// let USP = window.URLSearchParams;
/*
function serialize(params, obj, scope) {
	if(Array.isArray(obj)) {
		obj.forEach(item=>serialize(params, item, `${scope}[]`));
	} else if(isPlainObject(obj)) {
		if(scope)
			Object.keys(obj).forEach(key=>serialize(params, obj[key], `${scope}[${key}]`));
		else
			Object.keys(obj).forEach(key=>serialize(params, obj[key], key));
	} else {
		params.append(scope, obj);
	}
}*/
/*
function getFormData(data) {
	if(data instanceof FormData) {
		return data;
	}else if(data instanceof USP){
		let fd = new FormData();
		for(let p of data) {
			fd.append(p[0], p[1]);
		}
		return fd;
	}else if($type(data)=='string') {
		let searchParams = new USP(data);
		let fd = new FormData();
		for(let p of searchParams) {
			fd.append(p[0], p[1]);
		}
		return fd;
	} else if(isPlainObject(data)) {
		let fd = new FormData();
		serialize(fd, data);
		return fd;
	} else {
		return new FormData();
	}
}

function mergeFormData(target, ...fdList) {
	target = getFormData(target);
	for(let fd of fdList) {
		for(let p of getFormData(fd)) {
			target.append(p[0], p[1]);
		}
	}
	return target;
}
*/

export {$type, isObject, isPlainObject};