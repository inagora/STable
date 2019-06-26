module.exports = function(app, server){
	app.get('/ajaxList', (req, res)=>{
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
};