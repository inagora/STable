import {getFormData, mergeFormData} from './util';
let empty = function(){};
let ajaxSettings = {
	method: 'GET',
	dataType: 'json',
	accepts: {
		json: 'application/json'
	},
	// Default timeout
	timeout: 0,
	// Whether the browser should be allowed to cache GET responses
	cache: true
};

function appendQuery(url, query) {
	return url+(url.includes('?')?'&':'?')+query;
}

export default class Ajax{
	constructor(setting) {
		this.setting = Object.assign({}, ajaxSettings, setting);
		this.setting.data = getFormData(this.setting.data);
	}

	request(options) {
		return new Promise((resolve, reject)=>{
			let data = getFormData();
			mergeFormData(data, this.setting.data, options.data);

			let setting = Object.assign({}, this.setting, options || {}),
				hashIndex = setting.url.indexOf('#');
	
			if (hashIndex > -1)
				setting.url = setting.url.slice(0, hashIndex);
			
			setting.method = setting.method.toUpperCase();
			if(['GET', 'HEAD'].includes(setting.method)) {
				let sp = new window.URLSearchParams();
				for(let p of data) {
					sp.append(p[0], p[1]);
				}
				setting.url = appendQuery(setting.url, sp.toString());
				data = null;
			}
	
			if (setting.cache === false)
				setting.url = appendQuery(setting.url, '_=' + Date.now());
	
			var dataType = setting.dataType,
				mime = setting.accepts[dataType],
				headers = {},
				setHeader = function (name, value) {
					headers[name.toLowerCase()] = [name, value];
				},
				protocol = /^([\w-]+:)\/\//.test(setting.url) ? RegExp.$1 : window.location.protocol,
				xhr = new window.XMLHttpRequest(),
				nativeSetHeader = xhr.setRequestHeader,
				abortTimeout;
	
			setHeader('X-Requested-With', 'XMLHttpRequest');
			setHeader('Accept', mime || '*/*');
			mime = setting.mimeType || mime;
			if (mime) {
				if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0];
				xhr.overrideMimeType && xhr.overrideMimeType(mime);
			}
			if (setting.contentType)
				setHeader('Content-Type', setting.contentType);
	
			if (setting.headers)
				for (let name in setting.headers)
					setHeader(name, setting.headers[name]);
	
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					xhr.onreadystatechange = empty;
					clearTimeout(abortTimeout);
					var result, error = false;
					if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
						result = xhr.responseText.trim();
						try {
							// http://perfectionkills.com/global-eval-what-are-the-options/
							// sanitize response accordingly if data filter callback provided
							result = result && JSON.parse(result) || {};
						} catch (e) {
							error = e;
						}
	
						if (error){
							reject([xhr, 'parsererror', error]);
							return;
						}
						
						if(result && typeof result.code!='undefined') {
							result.errno = result.code;
							result.errmsg = result.msg;
						}
						resolve(result);
					} else {
						reject([xhr, xhr.status ? 'error' : 'abort', xhr.statusText || null]);
					}
				}
			};
			xhr.open(setting.method, setting.url);
	
			for (let name in headers)
				nativeSetHeader.apply(xhr, headers[name]);
	
			if (setting.timeout > 0)
				abortTimeout = setTimeout(function () {
					xhr.onreadystatechange = empty;
					xhr.abort();
					reject([xhr, 'timeout', null]);
				}, setting.timeout);
	
			// avoid sending empty string (#319)
			xhr.send(data);
		});
	}
}