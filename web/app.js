const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const serve = require('koa-static');
const koaBody = require('koa-body');
const app = new Koa();
const router = new Router();

app.use(serve(path.resolve(__dirname, 'public')));
app.use(views(path.resolve(__dirname, 'views'), {
	map: {
		njk: 'nunjucks'
	}
}));

router.get('/', (ctx, next) => {
	// ctx.router available
	return ctx.render('index.njk');
});
router.get('/demo', (ctx, next) => {
	// ctx.router available
	return ctx.render('demo.njk');
});
router.get('/ajaxGetDemo/:demo',(ctx, next)=>{
	let content = {};
	console.log(ctx.params.demo);
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
router.get('/editor', (ctx, next) => {
	// ctx.router available
	return ctx.render('editor.njk');
});
router.get('/playground', (ctx, next) => {
	// ctx.router available
	return ctx.render('playground.njk');
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
		},Math.round(Math.random()*200));
		
	});
});

router.all('/ajaxWaterfall',koaBody({strict: false}), (ctx, next)=>{
	let params = Object.assign({},ctx.query, ctx.request.body);
	let allGoods = require('./data.json');
	let count = parseInt(params.count||20, 10);
	let goods_id = params.goods_id||'';
	if(params.goods_name){
		let name = params.goods_name.toLocaleLowerCase();
		allGoods = allGoods.filter(item=>item.goods_name.toLocaleLowerCase().includes(name));
	}
	let retList = [];
	if(goods_id) {
		let index = -1;
		for(let i=0,len=allGoods.length;i<len;i++){
			if(allGoods[i].goods_id == goods_id){
				index = i;
				break;
			}
		}
		if(index>=0) {
			if(count>0)
				retList = allGoods.slice(index+1, index+count+1);
			else
				retList = allGoods.slice(index+count, index);
		}
	} else {
		retList = allGoods.slice(0, Math.abs(count));
	}

	return new Promise(r=>{
		setTimeout(()=>{
			ctx.body={
				errno: 0,
				data: {
					list: retList
				}
			};
			r();
		},Math.round(Math.random()*10000));
	});
});

//const loc = ["美国", "中国", "日本", "法国", "英国", "中国香港", "意大利", "德国", "韩国", "加拿大", "西班牙", "中国台湾", "印度", "西德", "澳大利亚", "苏联", "比利时", "瑞士", "瑞典", "阿根廷", "俄罗斯", "墨西哥", "波兰", "丹麦", "荷兰", "巴西", "奥地利", "泰国"];
//const type = ["剧情", "喜剧", "短片", "爱情", "纪录片", "动作", "惊悚", "恐怖", "动画", "犯罪", "冒险", "家庭", "悬疑", "奇幻", "科幻", "战争", "传记", "音乐", "历史", "歌舞", "西部", "运动", "古装", "武侠", "戏曲", "黑色电影", "儿童", "新闻", "真人秀", "舞台艺术", "成人", "脱口秀", "游戏秀", "情色", "文艺", "同性", "女性", "青春", "励志", "微电影", "灾难"];
router.get('/ajaxBrandList', koaBody(), (ctx, next)=>{
	let allBrands = require('./brand.json');
	return ctx.body={
		errno: 0,
		data: {
			list: allBrands
		}
	};
});
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