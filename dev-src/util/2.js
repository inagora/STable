let class2type = {},
	toString = class2type.toString,
	empty = function(){};
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

function appendQuery(url, query) {
	return url+(url.includes('?')?'&':'?')+query;
}

export function ajax(options) {
	return new Promise((resolve, reject)=>{
		let settings = Object.assign({}, ajaxSettings, options || {}),
			hashIndex = settings.url.indexOf('#');

		if (hashIndex > -1)
			settings.url = settings.url.slice(0, hashIndex);

		if(settings.data) {
			if(isPlainObject(settings.data)) {
				let params = [];
				serialize(params, settings.data);
				settings.data = params.join('&');
			}
		}
		settings.method = settings.method.toUpperCase();
		if(['GET', 'HEAD'].contains(settings.method)) {
			settings.url = appendQuery(settings.url, settings.data);
			settings.data = null;
		}

		if (settings.cache === false)
			settings.url = appendQuery(settings.url, '_=' + Date.now());

		var dataType = settings.dataType,
			mime = settings.accepts[dataType],
			headers = {},
			setHeader = function (name, value) {
				headers[name.toLowerCase()] = [name, value];
			},
			protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
			xhr = new window.XMLHttpRequest(),
			nativeSetHeader = xhr.setRequestHeader,
			abortTimeout;

		setHeader('X-Requested-With', 'XMLHttpRequest');
		setHeader('Accept', mime || '*/*');
		mime = settings.mimeType || mime;
		if (mime) {
			if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0];
			xhr.overrideMimeType && xhr.overrideMimeType(mime);
		}
		if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
			setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');

		if (settings.headers)
			for (let name in settings.headers)
				setHeader(name, settings.headers[name]);

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
						result = result ? {} : JSON.parse(result);
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
		xhr.open(settings.type, settings.url);

		for (let name in headers)
			nativeSetHeader.apply(xhr, headers[name]);

		if (settings.timeout > 0)
			abortTimeout = setTimeout(function () {
				xhr.onreadystatechange = empty;
				xhr.abort();
				reject([xhr, 'timeout', null]);
			}, settings.timeout);

		// avoid sending empty string (#319)
		xhr.send(settings.data || null);
	});
}