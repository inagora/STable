/**
 * 把ajax设计为一个需要实例化的类，而不是之前是一个函数工具，是考虑到每个
 * STable实例可能都有不同的默认参数，比如 headers，默认参数等
 * https://segmentfault.com/a/1190000008484070
 * https://bubkoo.com/2015/05/08/introduction-to-fetch/
 * 注意，所有参数完全遵照fetch的命名和含义，不向jquery兼容
 */

function isPlainObject(obj) {
	return obj!=null && Object.getPrototypeOf(obj) == Object.prototype;
}
function serialize(params, obj, scope) {
	if(Array.isArray(obj)) {
		obj.forEach(item=>serialize(params, item, `${scope}[]`));
	} else if(isPlainObject(obj)) {
		if(scope)
			Object.keys(obj).forEach(key=>serialize(params, obj[key], `${scope}[$key]`));
		else
		Object.keys(obj).forEach(key=>serialize(params, obj[key], key));
	} else {
		params.push(encodeURIComponent(scope) + '=' + encodeURIComponent(obj))
	}
}
 //注意，只支持string、URLSearchParams、FormData三种类型
function getURLSearchParams(body){
	if(body instanceof window.URLSearchParams){
		return body;
	} else if(typeof body=='string' || body instanceof window.String) {
		return new URLSearchParams(body);
	} else if(body instanceof window.FormData) {
		let sp = new URLSearchParams();
		for(let p of body) {
			sp.append(p[0], p[1]);
		}
		return sp;
	} else {
		let params = [];
		serialize(params, body);
		return new URLSearchParams(params.join('&'));
	}
}
class Ajax {
	/**
	 * 
	 * @param {Object} setting
	 * 	@option {String} method 请求方法 
	 * 	@option {Object} headers 请求的头信息
	 */
	constructor(setting) {
		this.ajaxSetting = Object.assign({
			method: 'GET',
			mode: 'cors',
			credentials: 'same-origin'
		}, setting);
		if(this.ajaxSetting.body) {
			this.ajaxSetting.body = getURLSearchParams(this.ajaxSetting.body);
		}
	}

	fetch(url, options){
		if(url.includes('#')) {
			url = url.slice(0, url.indexOf('#'));
		}
		let body = new URLSearchParams();
		if(this.ajaxSetting.body) {
			for(let p of this.ajaxSetting.body) {
				body.append(p[0], p[1]);
			}
		}
		if(options.body) {
			for(let p of getURLSearchParams(options.body)){
				body.append(p[0], p[1]);
			}
		}
		let setting = Object.assign({}, this.ajaxSetting, options, {body});
		setting.method = setting.method.toUpperCase();
		if(setting.method=='GET' || setting.method=='HEAD') {
			url += (url.includes('?')?'&':'?')+body.toString();
			delete setting.body;
		}
		return window.fetch(url, setting).then()
	}
}
export function ajax(url, setting){
	return fetch();
}
export function get() {
	//return ajax(parseArguments.apply(null, arguments));
}

export function post() {
	// var options = parseArguments.apply(null, arguments);
	// options.type = 'POST';
	// return ajax(options);
}