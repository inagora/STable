const fs = require('fs');
const path = require('path');
module.exports = function(app, server){
	app.all('/ajaxList', (req, res)=>{
		let params = req.query;
		let allMovies = require('./movies.json');
		let page = parseInt(params.page||1);
		let count = parseInt(params.count||20);
		if(params.name){
			let name = params.name.toLocaleLowerCase();
			allMovies = allMovies.filter(item=>item.name.toLocaleLowerCase().includes(name));
		}
		if(params.movieType){
			let movieType = params.movieType.toLocaleLowerCase();
			allMovies = allMovies.filter(item=>{
				let mt = item.movieType;
				if(Array.isArray(mt)){
					mt = mt.join('|');
				}
				return mt.toLocaleLowerCase().includes(movieType);
			});
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

		if(params.sublist_demo) {
			allMovies.forEach(item=>{
				if(!Array.isArray(item.movieType))
					item.movieType = (item.movieType||'').split('|');
			});
		}

		let t = Math.random();
		if(t>0.9)
			t = t*1000;
		else
			t=0;
		setTimeout(()=>{
			res.json({
				errno: 0,
				data: {
					list: allMovies,
					page_count,
					page
				}
			});
		},Math.round(t));
	});
	app.get('/ajaxWaterfall',(req, res)=>{
		let params = req.query;
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

		let t = Math.random();
		if(t>0.9)
			t = t*1000;
		else
			t=0;
		setTimeout(()=>{
			res.json({
				errno: 0,
				data: {
					list: allMovies
				}
			});
		},Math.round(t));
	});
	app.get('/ajaxFormList',(req,res)=>{
		// let params = req.data;

		let t = Math.random();
		if(t>0.9)
			t = t*1000;
		else
			t=0;

		setTimeout(()=>{
			res.json({
				errno: 0,
				data: [
					{
						type: 'input',
						label: '活动名称',
						placeholder: '请填写活动名称',
						name: 'activity_name',
					},
					{
						type: 'textarea',
						label: '活动形式',
						placeholder: '请填写活动形式',
						name: 'activity_textarea',
					},
					{
						type: 'select',
						label: '活动区域',
						placeholder: '请选择活动区域',
						name: 'activity_region',
						options:[
							{
								label: '上海',
								value: '0'
							},
							{
								label: '北京',
								value: '1'
							},
							{
								label: '杭州',
								value: '2'
							}
						]
					},
					{
						type: 'checkbox',
						label: '活动性质',
						options: [
							{label: '美食/餐厅线上活动',value:'001'},
							{label: '地推活动',value:'002'},
							{label: '线下主题活动',value:'003'},
							{label: '单纯品牌曝光',value:'004'},
						],
						name: 'activity_kind',
					},
					{
						type: 'radio',
						label: '是否收费',
						options: [
							{label: '收费',value: 1},
							{label: '免费',value: 0},
						],
						name: 'activity_fee',
					},
					{
						type: 'switch',
						label: '不接收广告',
						value: false,
						name: 'activity_ad',
					},
					// {
					// 	type: 'button',
					// 	options: [
					// 		{
					// 			text: '取消',
					// 			theme: 'default',
					// 			handle: 'cancel',
					// 		},
					// 		{
					// 			text: '提交',
					// 			theme: 'primary',	
					// 			handle: 'submit',
					// 		}
					// 	]
					// }
				]
			});
		},Math.round(t));
	});
	app.post('/ajaxAdd',(req, res)=>{
		res.json({
			errno: 0,
			errmsg: 'this is just a demo, it will not add a record really'
		});
	});
	app.post('/ajaxUpdate',(req, res)=>{
		res.json({
			errno: 0,
			errmsg: 'this is just a demo, it will not update a record really'
		});
	});
	app.post('/ajaxDel',(req, res)=>{
		res.json({
			errno: 0,
			errmsg: 'this is just a demo, it will not remove this record really'
		});
	});
	app.post('/ajaxBatDel',(req, res)=>{
		res.json({
			errno: 0,
			errmsg: 'this is just a demo, it will not remove some records really'
		});
	});
	app.get('/demoViewer', (req, res)=>{
		let params = req.query;
		let code = fs.readFileSync(path.resolve(__dirname,`./demo/${params.demo}.html`), 'utf8');
		code = code.replace(/https:\/\/dc\.wfxteam\.com/g, '');
		let html = fs.readFileSync(path.resolve(__dirname,`./demo-viewer.html`), 'utf8');
		html = html.replace(/\{\{demo\}\}/, code);
		res.send(html);
	});
};