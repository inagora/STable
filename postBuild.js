const fs = require('fs');
// combine STable.full.min.js
let vueCode = fs.readFileSync('./node_modules/vue/dist/vue.min.js', 'utf-8');
let elementCode = fs.readFileSync('./node_modules/element-ui/lib/index.js', 'utf-8');
let stableCode = fs.readFileSync('./dist/STable.min.js', 'utf-8');
fs.writeFileSync('./dist/STable.full.min.js', [vueCode, elementCode, stableCode].join('\n'), 'utf-8');
console.log('文件 STable.full.min.js生成完成');

// combin STable.full.min.css
let elementCssCode = fs.readFileSync('./node_modules/element-ui/lib/theme-chalk/index.css', 'utf-8');
let elementFont = new Buffer(fs.readFileSync('./node_modules/element-ui/lib/theme-chalk/fonts/element-icons.woff')).toString('base64');
elementCssCode = elementCssCode.replace('url(fonts/element-icons.woff)', `url(data:application/font-woff;base64,${elementFont})`);
let faCode = fs.readFileSync('./node_modules/font-awesome/css/font-awesome.min.css', 'utf-8');
let faFont = new Buffer(fs.readFileSync('./node_modules/font-awesome/fonts/fontawesome-webfont.woff2')).toString('base64');
faCode = faCode.replace(/font-face\{font-family:'FontAwesome';src:url\(.+?format\('svg'\)/, `font-face{font-family:'FontAwesome';src: url(data:application/font-woff2;base64,${faFont}) format('woff2')`);
let stableCssCode = fs.readFileSync('./dist/STable.min.css', 'utf-8');
fs.writeFileSync('./dist/STable.full.min.css', [elementCssCode, faCode, stableCssCode].join('\n'), 'utf-8');
console.log('文件 STable.full.min.css生成完成');