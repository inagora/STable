const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const koaBody = require('koa-body');
module.exports = function(middleware) {
	const app = new Koa();
	const router = new Router();
	app.use(middleware);
	app.use(serve(path.resolve(__dirname, 'public')));

	router.get('/ajaxGetDemo/:demo',(ctx, next)=>{
		let content = {};
		['js', 'css', 'html'].forEach(type=>{
			let file = path.resolve(__dirname, 'public/resource/demo/',ctx.params.demo, 'index.'+type);
			if(fs.existsSync(file)) {
				content[type] = fs.readFileSync(file, 'utf8');
			} else {
				content[type] = '';
			}
		});
		return ctx.body=content;
	});
	router.all('/ajaxList',koaBody({strict: false}), (ctx, next)=>{
		let params = Object.assign({},ctx.query, ctx.request.body);
		let allMovies = require('./movies.json');
		let page = parseInt(params.page||1, 10);
		let count = parseInt(params.count||20, 10);
		if(params.name){
			let name = params.name.toLocaleLowerCase();
			allMovies = allMovies.filter(item=>item.name.toLocaleLowerCase().includes(name));
		}
		if(params.movieType){
			let movieType = params.movieType.toLocaleLowerCase();
			allMovies = allMovies.filter(item=>item.movieType.toLocaleLowerCase().includes(movieType));
		}
		if(params.stime) {
			allMovies = allMovies.filter(item=>item.realTime&&item.realTime.replace(/[年月日]/g,'-')>=params.stime);
		}
		if(params.etime) {
			allMovies = allMovies.filter(item=>item.realTime&&item.realTime.replace(/[年月日]/g,'-')<=params.etime);
		}
		if(params.sort_key && params.sort_direction) {
			let key = params.sort_key, dir=params.sort_direction;
			allMovies.sort(function(a,b){
				if(dir=='asc'){
					return a[key] > b[key] ? 1: -1;
				} else {
					return a[key] < b[key] ? 1 : -1;
				}
			});
		}
		//allMovies.forEach(item=>{console.log(item.rating)})
		let page_count = Math.ceil(allMovies.length/count);
		
		allMovies = allMovies.slice((page-1)*count, page*count);
		return new Promise(r=>{
			let t = Math.random();
			if(t<0.2)
				t = t*100000;
			else if(t<0.5)
				t = t*5000;
			else
				t=0;
			setTimeout(()=>{
				ctx.body={
					errno: 0,
					data: {
						list: allMovies,
						page_count,
						page
					}
				};
				r();
			},Math.round(t));
			
		});
	});

	router.all('/ajaxWaterfall',koaBody({strict: false}), (ctx, next)=>{
		let params = Object.assign({},ctx.query, ctx.request.body);
		let allMovies = require('./movies.json');
		let count = parseInt(params.count||20, 10);
		if(params.name){
			let name = params.name.toLocaleLowerCase();
			allMovies = allMovies.filter(item=>item.name.toLocaleLowerCase().includes(name));
		}
		if(params.movieType){
			let movieType = params.movieType.toLocaleLowerCase();
			allMovies = allMovies.filter(item=>item.movieType.toLocaleLowerCase().includes(movieType));
		}
		if(params.stime) {
			allMovies = allMovies.filter(item=>item.realTime&&item.realTime.replace(/[年月日]/g,'-')>=params.stime);
		}
		if(params.etime) {
			allMovies = allMovies.filter(item=>item.realTime&&item.realTime.replace(/[年月日]/g,'-')<=params.etime);
		}
		if(params.sort_key && params.sort_direction) {
			let key = params.sort_key, dir=params.sort_direction;
			allMovies.sort(function(a,b){
				if(dir=='asc'){
					return a[key] > b[key] ? 1: -1;
				} else {
					return a[key] < b[key] ? 1 : -1;
				}
			});
		}

		let index = -1;
		if(params.id) {
			for(let i=0;i<allMovies.length;i++) {
				if(allMovies[i].id == params.id){
					index = i;
					break;
				}
			}
		}
		if(index<0 && params.id!='') {
			return {
				errno: -1,
				errmsg: 'id有问题'
			};
		}
		if(count>0)
			allMovies = allMovies.slice(index+1, index+count+1);
		else
			allMovies = allMovies.slice(index+count, index);
		return new Promise(r=>{
			let t = Math.random();
			if(t<0.05)
				t = t*10*5000+10000;	//一定超时
			else if(t<0.2)
				t = (t-0.1)*10*5000;		//时间在0s到5s返回结果
			else
				t = t*50;	//快速返回结果
			setTimeout(()=>{
				ctx.body={
					errno: 0,
					data: {
						list: allMovies
					}
				};
				r();
			},Math.round(t));
			
		});
	});

	//const loc = ["美国", "中国", "日本", "法国", "英国", "中国香港", "意大利", "德国", "韩国", "加拿大", "西班牙", "中国台湾", "印度", "西德", "澳大利亚", "苏联", "比利时", "瑞士", "瑞典", "阿根廷", "俄罗斯", "墨西哥", "波兰", "丹麦", "荷兰", "巴西", "奥地利", "泰国"];
	//const type = ["剧情", "喜剧", "短片", "爱情", "纪录片", "动作", "惊悚", "恐怖", "动画", "犯罪", "冒险", "家庭", "悬疑", "奇幻", "科幻", "战争", "传记", "音乐", "历史", "歌舞", "西部", "运动", "古装", "武侠", "戏曲", "黑色电影", "儿童", "新闻", "真人秀", "舞台艺术", "成人", "脱口秀", "游戏秀", "情色", "文艺", "同性", "女性", "青春", "励志", "微电影", "灾难"];
	
	router.post('/ajaxUpload',koaBody({ multipart: true }), (ctx)=>{
		const file = ctx.request.files.file;
		const reader = fs.createReadStream(file.path);
		const stream = fs.createWriteStream(path.join(__dirname, 'public/tmp/', file.name));
		reader.pipe(stream);
		return ctx.body={
			errno: 0,
			data: {
				url: '/tmp/'+file.name
			}
		};
	});
	app
		.use(router.routes())
		.use(router.allowedMethods());

	app.listen(3000);
};