const fs = require('fs');
module.exports = (options, ctx) => {
	return {
		ready(){
			console.log('ready');
			console.log(options);
			console.log(ctx);
		},
		updated (pagePaths) {
			console.log(pagePaths);
			console.log(ctx)
			// ...
		},
		async generated (pagePaths) {
			console.log(pagePaths)
			// for(let file of pagePaths){
			// 	if(file.endsWith('api.html')) {
			// 		let code = fs.readFileSync(file, 'utf8');
			// 		code = code.replace(/\+\+\+\s*demo\s*:\s*(.+?)\+\+\+/gi, function(_, demoName){
			// 			console.log(demoName)
			// 			return `
			// 				<div class="st-demo">
			// 					<div class="st-code"></div>
			// 					<div class="st-trigger-bar>
			// 						<div class="st-trigger">
			// 							<div class="st-demo-name">demo: ${demoName}</div>
			// 							<div class="st-trigger-sign"></div>
			// 							<div class="st-trigger-desc">显示代码</div>
			// 						</div>
			// 					</div>
			// 				</div>
			// 			`;
			// 		});
			// 		fs.writeFileSync(file, code, 'utf8');
			// 	}
			// }
		}
	}
}