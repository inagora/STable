const fs = require('fs');
let text = fs.readFileSync('./iconfont.css', 'utf8');

text = text
	.replace(/@font-face\s*\{(?:.|\n)+?(url\('data:application.+?format\('woff2'\))(?:.|\n)*?\}\s*((?:.|\n)+)/, (_,_1,_2)=>{
	return `@font-face {
		font-family: "st-iconfont";
		src: ${_1};
	}
	${_2}`;
})
	.replace('font-family: "iconfont"', 'font-family: "st-iconfont"')
	.replace('.iconfont', '.st-iconfont')
	.replace(/\.(icon-)/g, '.st-$1');

fs.writeFileSync('./iconfont.css', text, 'utf8');