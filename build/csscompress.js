const fs = require('fs');
const path = require('path');
const cssFile = path.resolve(__dirname, '../dist/STable.min.css');
const jsFile = path.resolve(__dirname, '../dist/STable.min.js');
var whiteList = [
	'st-icon',
	'st-icon-',
	'st-form-size-'
];
var cssMap = {};
const CHARS = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');
var charIndex = 0;
function id(){
	let cs = [];
	let idx = charIndex+1;
	do{
		idx--;
		let c = CHARS[idx%CHARS.length];
		cs.push(c);
		idx = Math.floor(idx/CHARS.length);
	}while(idx>0);
	charIndex++;
	return cs.reverse().join('');
}

function isInWhiteList(clsName){
	return whiteList.some(key=>{
		if(key.endsWith('-')) {
			return clsName.startsWith(key);
		} else {
			return clsName==key;
		}
	});
}
function run(){
	console.log('=========== start compress for cssName ===========');
	let cssStr = fs.readFileSync(cssFile, 'utf8');
	cssStr = cssStr.replace(/\.([a-z].+?(?=[\s:\{,>+\.\[]))/gi, function($_,clsName){
		if(!/^st-/.test(clsName)){
			console.error('类名未以 .st- 开头: '+clsName);
			return $_;
		} else if(!/^[a-z0-9\-]+$/.test(clsName)){
			console.error('类名中含有特殊字符: '+clsName);
			return $_;
		} else if(isInWhiteList(clsName)){
			return $_;
		} else {
			if(!cssMap[clsName])
				cssMap[clsName] = 'st-'+id();
			return '.'+cssMap[clsName];
		}
	});

	let jsStr = fs.readFileSync(jsFile, 'utf8');
	jsStr = jsStr.replace(/st-.+?(?=['"\s:\{,>+\.\[])/gi, function( clsName){
		if(!/[a-z0-9]$/i.test(clsName)){
			console.error(`class name error: ${clsName}`);
			return clsName;
		} else if(isInWhiteList(clsName)){
			return clsName;
		} else {
			if(!cssMap[clsName]){
				console.log('clsName not found in cssMap: '+clsName);
				cssMap[clsName] = 'st-'+id();
			}
			return cssMap[clsName];
		}
	});

	fs.writeFileSync(cssFile, cssStr, 'utf8');
	fs.writeFileSync(jsFile, jsStr, 'utf8');
	fs.writeFileSync(path.resolve(__dirname, '../dist/css-name-map.json'), JSON.stringify(cssMap,null,'\t'));
}
run();