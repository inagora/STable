let editorType = (new URLSearchParams(window.location.hash.substr(1))).get('type');
let mode=  {js:'javascript', css:'css',html: 'xml'}[editorType];
window.cm = null;

window.addEventListener('message',evt=>{
	if(evt.origin == window.location.origin) {
		if(cm){
			cm.setValue(evt.data);
		}else{
			cm = CodeMirror(document.body, {
				value: evt.data,
				mode,
				theme: "monokai",
				lineNumbers: true,
				indentWithTabs: true,
			});
		}
	}
}, false);
window.parent.postMessage(editorType+'-ready', window.location.origin);