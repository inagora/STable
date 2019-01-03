let class2type = {},
	toString = class2type.toString,
	scriptTypeRE = /^(?:text|application)\/javascript/i,
	xmlTypeRE = /^(?:text|application)\/xml/i,
	blankRE = /^\s*$/,
	jsonType = 'application/json',
	htmlType = 'text/html';
"Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(name => {
	class2type["[object " + name + "]"] = name.toLowerCase();
});

function $type(obj) {
	return obj == null ? String(obj) :
		class2type[toString.call(obj)] || "object";
}

function isFunction(value) {
	return $type(value) == "function";
}

function isObject(obj) {
	return $type(obj) == "object";
}

function isPlainObject(obj) {
	return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}
// handle optional data/success arguments
function parseArguments(url, data, success, dataType) {
	if (isFunction(data)) {
		dataType = success;
		success = data;
		data = undefined;
	}
	if (!isFunction(success)) {
		dataType = success;
		success = undefined;
	}
	return {
		url,
		data,
		success,
		dataType
	};
}

var param = function(obj, traditional){
	var params = [];
	params.add = function(key, value) {
		if (isFunction(value)) value = value();
		if (value == null) value = "";
		//this.push(decodeURIComponent(key) + '=' + decodeURIComponent(value));
		this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
	};
	serialize(params, obj, traditional);
	return params.join('&').replace(/%20/g, '+');
};
function appendQuery(url, query) {
	if (query == '') return url;
	return (url + '&' + query).replace(/[&?]{1,2}/, '?');
}
function serialize(params, obj, scope){
	var type, array = Array.isArray(obj), hash = isPlainObject(obj);
	Object.keys(obj).forEach(function(key) {
		let value = obj[key];
		type = $type(value);
		if (scope) key = scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']';
		// handle data in serializeArray() format
		if (!scope && array) params.add(value.name, value.value);
		// recurse into nested objects
		else if (type == "array" || type == "object")
			serialize(params, value, key);
		else params.add(key, value);
	});
}
// serialize payload and append it to the URL for GET requests
function serializeData(options) {
	if (options.processData && options.data && $type(options.data) != "string")
		options.data = param(options.data);
	console.log(options.data)
	if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
		options.url = appendQuery(options.url, options.data), options.data = undefined;
}

function mimeToDataType(mime) {
	if (mime) mime = mime.split(';', 2)[0];
	return mime && ( mime == htmlType ? 'html' :
		mime == jsonType ? 'json' :
			scriptTypeRE.test(mime) ? 'script' :
				xmlTypeRE.test(mime) && 'xml' ) || 'text';
}
function ajaxDataFilter(data, type, settings) {
	if (settings.dataFilter == empty)
		return data;
	var context = settings.context;
	return settings.dataFilter.call(context, data, type);
}
// Empty function, used as default callback
function empty() {}
let ajaxSettings = {
	// Default type of request
	type: 'GET',
	// Callback that is executed before request
	beforeSend: empty,
	// Callback that is executed if the request succeeds
	success: empty,
	// Callback that is executed the the server drops error
	error: empty,
	// Callback that is executed on request complete (both: error and success)
	complete: empty,
	// The context for the callbacks
	context: null,
	// Whether to trigger "global" Ajax events
	global: true,
	// Transport
	xhr: function () {
		return new window.XMLHttpRequest();
	},
	// MIME types mapping
	// IIS returns Javascript as "application/x-javascript"
	accepts: {
		json: 'application/json'
	},
	// Default timeout
	timeout: 0,
	// Whether data should be serialized to string
	processData: true,
	// Whether the browser should be allowed to cache GET responses
	cache: true,
	//Used to handle the raw response data of XMLHttpRequest.
	//This is a pre-filtering function to sanitize the response.
	//The sanitized response should be returned
	dataFilter: empty
};

function ajax(options) {
	return new Promise((resolve, reject)=>{
		let settings = Object.assign({}, ajaxSettings, options || {}),
			hashIndex;

		if ((hashIndex = settings.url.indexOf('#')) > -1)
			settings.url = settings.url.slice(0, hashIndex);
		serializeData(settings);

		var dataType = settings.dataType;

		if (settings.cache === false)
			settings.url = appendQuery(settings.url, '_=' + Date.now());

		var mime = settings.accepts[dataType],
			headers = {},
			setHeader = function (name, value) {
				headers[name.toLowerCase()] = [name, value];
			},
			protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
			xhr = settings.xhr(),
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
		xhr.setRequestHeader = setHeader;

		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				xhr.onreadystatechange = empty;
				clearTimeout(abortTimeout);
				var result, error = false;
				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
					dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));

					if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob')
						result = xhr.response;
					else {
						result = xhr.responseText;

						try {
							// http://perfectionkills.com/global-eval-what-are-the-options/
							// sanitize response accordingly if data filter callback provided
							result = ajaxDataFilter(result, dataType, settings);
							if (dataType == 'json')
								result = blankRE.test(result) ? null : JSON.parse(result);
						} catch (e) {
							error = e;
						}

						if (error){
							reject([xhr, 'parsererror', error]);
							return;
						}
					}
					if(result && typeof result.code!='undefined') {
						result.errno = result.code;
						result.errmsg = result.msg;
					}
					resolve([result, 'success', xhr]);
				} else {
					reject([xhr, xhr.status ? 'error' : 'abort', xhr.statusText || null]);
				}
			}
		};

		xhr.open(settings.type, settings.url);

		if (settings.xhrFields)
			for (let name in settings.xhrFields)
				xhr[name] = settings.xhrFields[name];

		if(window._csrf_key){
			setHeader(window._csrf_key, window._csrf_token||'');
		} else if(window._token) {
			setHeader('X-CSRF-TOKEN', window._token);
		}
		for (let name in headers)
			nativeSetHeader.apply(xhr, headers[name]);

		if (settings.timeout > 0)
			abortTimeout = setTimeout(function () {
				xhr.onreadystatechange = empty;
				xhr.abort();
				reject([xhr, 'timeout', null]);
			}, settings.timeout);

		// avoid sending empty string (#319)
		xhr.send(settings.data ? settings.data : null);
	});
}
export {
	ajax
};
export function get() {
	return ajax(parseArguments.apply(null, arguments));
}

export function post() {
	var options = parseArguments.apply(null, arguments);
	options.type = 'POST';
	return ajax(options);
}