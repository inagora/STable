const fs = require('fs');
const path = require('path');
var multer  = require('multer');
var upload = multer({ 
	dest: path.resolve(__dirname,'upload/'),
	limits: {
		fieldSize: 30*1024,
		fileSize: 30*1024,
		headerPairs: 100
	}
});
var up = upload.single('file');
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
		if(params.ids) {
			let ids = params.ids.split('|').map(item=>parseInt(item||0));
			allMovies = allMovies.filter(item=>ids.includes(item.id));
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
	app.get('/asyncOptions', (req,res)=>{
		setTimeout(()=>{
			res.json({
				errno: 0,
				data: {
					options:  [{"text":"护肤美妆","value":"217","options":[{"text":"基础护肤","value":"220","options":[{"text":"面膜","value":"426"},{"text":"卸妆","value":"411"},{"text":"洁面","value":"423"},{"text":"化妆水","value":"422"},{"text":"乳液","value":"428"},{"text":"面霜","value":"427"},{"text":"面部精华","value":"424"},{"text":"眼霜眼膜","value":"430"},{"text":"唇部护理","value":"419"},{"text":"防晒","value":"420"},{"text":"护肤套装","value":"421"}]},{"text":"个性美妆","value":"400","options":[{"text":"妆前隔离","value":"403"},{"text":"粉底/气垫","value":"714"},{"text":"粉饼","value":"715"},{"text":"蜜粉/散粉","value":"716"},{"text":"BB霜/CC霜/素颜霜","value":"717"},{"text":"遮瑕","value":"415"},{"text":"修容","value":"412"},{"text":"唇妆","value":"406"},{"text":"腮红","value":"409"},{"text":"眉笔/粉","value":"407"},{"text":"眼线","value":"413"},{"text":"睫毛膏","value":"404"},{"text":"眼影","value":"414"},{"text":"香水香氛","value":"410"},{"text":"彩妆套装","value":"470"}]},{"text":"美容工具","value":"221","options":[{"text":"化妆棉","value":"433"},{"text":"彩妆工具","value":"431"},{"text":"吸油纸","value":"442"},{"text":"清洁用品","value":"439"}]}]},{"text":"个人洗护","value":"792","options":[{"text":"洗发护发","value":"794","options":[{"text":"洗发水","value":"793"},{"text":"护发素","value":"795"},{"text":"发膜","value":"796"},{"text":"染发造型","value":"798"},{"text":"护发精油","value":"797"},{"text":"生发增发","value":"799"},{"text":"洗护套装","value":"800"}]},{"text":"身体护理","value":"802","options":[{"text":"沐浴露/皂","value":"803"},{"text":"身体乳","value":"804"},{"text":"浴盐","value":"805"},{"text":"磨砂膏","value":"807"},{"text":"护手霜","value":"806"},{"text":"洗手液","value":"808"},{"text":"足部护理","value":"809"},{"text":"止汗/脱毛/香体","value":"810"},{"text":"纤体塑形","value":"811"}]},{"text":"口腔护理","value":"812","options":[{"text":"牙膏","value":"813"},{"text":"牙刷","value":"814"},{"text":"漱口水","value":"815"},{"text":"牙线","value":"816"},{"text":"口气清新","value":"817"},{"text":"其他口腔护理","value":"818"}]},{"text":"女性护理","value":"819","options":[{"text":"卫生巾","value":"820"},{"text":"护垫","value":"821"},{"text":"棉条","value":"822"},{"text":"私处护理","value":"823"}]},{"text":"健康护理","value":"824","options":[{"text":"眼罩","value":"825"},{"text":"口罩","value":"826"},{"text":"暖贴","value":"827"},{"text":"成人纸尿裤","value":"828"}]},{"text":"男士护理","value":"830","options":[{"text":"男士洁面","value":"831"},{"text":"男士面部护肤","value":"832"},{"text":"男士身体护理","value":"833"},{"text":"剃须用品","value":"834"}]},{"text":"身体护理工具","value":"835","options":[{"text":"美护发工具","value":"836"},{"text":"指甲护理","value":"837"},{"text":"美体护理","value":"838"}]}]},{"text":"中古奢品","value":"670","options":[{"text":"中古箱包配饰","value":"671","options":[{"text":"手拿包-中古","value":"1026"},{"text":"单肩包-中古","value":"673"},{"text":"手提包-中古","value":"675"},{"text":"双肩包-中古","value":"674"},{"text":"旅行箱-中古","value":"690"},{"text":"腰包-中古","value":"676"},{"text":"零钱包-中古","value":"678"},{"text":"钱包-中古","value":"677"},{"text":"女士腕表-中古","value":"686"},{"text":"男士腕表-中古","value":"685"},{"text":"中古围巾","value":"679"},{"text":"中古丝巾","value":"680"},{"text":"中古耳饰","value":"691"},{"text":"中古项链","value":"681"},{"text":"中古手饰","value":"683"},{"text":"中古戒指","value":"682"},{"text":"中古胸针","value":"684"},{"text":"小饰品-中古","value":"693"},{"text":"太阳镜-中古","value":"692"}]}]},{"text":"日式美食","value":"312","options":[{"text":"特色饮品","value":"317","options":[{"text":"茶饮料","value":"972"},{"text":"冲泡茶","value":"337"},{"text":"咖啡","value":"339"},{"text":"果汁汽水","value":"340"},{"text":"蜂蜜糖浆","value":"338"},{"text":"乳饮料","value":"973"},{"text":"果蔬汁","value":"974"},{"text":"奶茶可可","value":"975"},{"text":"水","value":"977"}]},{"text":"粮油副食","value":"314","options":[{"text":"方便拉面","value":"328"},{"text":"调味品","value":"335"},{"text":"方便即食","value":"512"},{"text":"果酱酱料","value":"471"},{"text":"浓汤香粥","value":"326"},{"text":"米面食材","value":"333"},{"text":"早餐麦片","value":"331"},{"text":"食用油","value":"334"}]},{"text":"休闲零食","value":"318","options":[{"text":"饼干糕点","value":"319"},{"text":"糖果","value":"350"},{"text":"薯条膨化","value":"347"},{"text":"伴手礼","value":"321"},{"text":"仙贝米果","value":"352"},{"text":"蜜饯果干","value":"343"},{"text":"坚果海味","value":"346"},{"text":"果冻布丁","value":"345"}]},{"text":"酒","value":"572","options":[{"text":"清酒","value":"978"},{"text":"果酒","value":"979"}]}]},{"text":"营养健康","value":"374","options":[{"text":"女性健康","value":"497","options":[{"text":"胶原蛋白","value":"781"},{"text":"减肥塑身","value":"387"},{"text":"美容养颜","value":"383"},{"text":"美白","value":"782"},{"text":"控糖燃脂","value":"783"},{"text":"青汁酵素","value":"381"},{"text":"内分泌","value":"505"}]},{"text":"隐形眼镜","value":"775","options":[{"text":"日抛美瞳","value":"784"},{"text":"月抛美瞳","value":"785"},{"text":"护理液","value":"786"}]},{"text":"健康养护","value":"776","options":[{"text":"维矿物质","value":"386"},{"text":"营养补充","value":"467"},{"text":"护眼","value":"787"},{"text":"肠胃养护","value":"376"},{"text":"缓解疲劳","value":"384"},{"text":"改善睡眠","value":"788"}]},{"text":"家中常备","value":"777","options":[{"text":"眼药水","value":"391"},{"text":"止痛退热","value":"507"},{"text":"口鼻护理","value":"791"},{"text":"皮肤护理","value":"789"}]},{"text":"男性健康","value":"778","options":[{"text":"解酒护肝","value":"790"},{"text":"补肾壮阳","value":"466"}]},{"text":"中老年健康","value":"779","options":[{"text":"三高调节","value":"499"},{"text":"骨骼健康","value":"378"},{"text":"心脑健康","value":"388"}]}]},{"text":"家居清洁","value":"719","options":[{"text":"衣物清洁","value":"720","options":[{"text":"洗衣液","value":"1023"},{"text":"洗衣凝珠","value":"1022"},{"text":"内衣清洁","value":"1020"},{"text":"柔顺增香","value":"1030"},{"text":"洗衣粉","value":"1021"},{"text":"衣物除味喷雾","value":"1029"},{"text":"鞋子清洁","value":"1027"},{"text":"洗衣皂","value":"1025"},{"text":"强力去渍","value":"1019"}]},{"text":"驱蚊驱虫","value":"736","options":[{"text":"驱蚊器","value":"747"},{"text":"驱蚊水","value":"748"},{"text":"防蚊贴/防蚊手环","value":"1018"},{"text":"蚊香液/片","value":"1016"},{"text":"杀虫剂","value":"1014"}]},{"text":"纸品","value":"737","options":[{"text":"湿巾","value":"750"},{"text":"手帕纸","value":"754"},{"text":"厨房用纸","value":"753"},{"text":"抽纸","value":"752"},{"text":"卷纸","value":"755"},{"text":"锡箔纸","value":"1032"}]},{"text":"清洁工具","value":"738","options":[{"text":"其他清洁工具","value":"757"},{"text":"家务手套","value":"759"},{"text":"卫浴清洁工具","value":"1013"},{"text":"地面清洁工具","value":"1012"},{"text":"厨房清洁工具","value":"1011"}]},{"text":"卧室清洁","value":"739","options":[{"text":"除螨","value":"762"},{"text":"加湿器清洁","value":"763"}]},{"text":"居家清洁","value":"990","options":[{"text":"管道疏通","value":"728"},{"text":"眼镜清洁","value":"766"},{"text":"防潮防霉","value":"1002"},{"text":"墙面玻璃清洁","value":"1005"},{"text":"家具清洁","value":"1004"},{"text":"地板清洁","value":"767"}]},{"text":"清香除味","value":"995","options":[{"text":"驱虫除臭","value":"260"},{"text":"空气芳香剂","value":"741"},{"text":"卫浴除臭","value":"743"},{"text":"冰箱除臭","value":"744"},{"text":"除味喷雾","value":"745"}]},{"text":"卫浴清洁","value":"994","options":[{"text":"马桶清洁","value":"731"},{"text":"洗衣机清洁","value":"732"},{"text":"浴室清洁","value":"1009"}]},{"text":"厨房清洁","value":"987","options":[{"text":"餐具清洁","value":"726"},{"text":"蔬果洗涤","value":"729"},{"text":"水垢清洁","value":"730"},{"text":"一次性用品","value":"999"},{"text":"厨房油污清洁","value":"997"}]},{"text":"汽车用品","value":"992","options":[{"text":"车用空气清香","value":"1006"},{"text":"车用清洁用品","value":"1008"}]}]},{"text":"家居生活","value":"235","options":[{"text":"厨具餐具","value":"1001","options":[{"text":"餐具","value":"1007"},{"text":"茶具","value":"1010"},{"text":"杯子水壶","value":"254"},{"text":"锅具","value":"1031"},{"text":"刀具","value":"1024"},{"text":"厨房用品","value":"1015"},{"text":"咖啡用具","value":"1035"},{"text":"砧板","value":"1036"},{"text":"酒具","value":"1034"},{"text":"厨房收纳","value":"1017"},{"text":"烘焙用具","value":"1033"},{"text":"保鲜盒","value":"1003"}]},{"text":"家居装饰","value":"1037","options":[{"text":"家用饰品","value":"1039"},{"text":"灯具","value":"1038"},{"text":"香薰用品","value":"1041"},{"text":"蜡烛","value":"1040"}]},{"text":"家用纺织","value":"1042","options":[{"text":"床上用品","value":"1043"},{"text":"毛巾浴巾","value":"1044"},{"text":"鞋类及配件","value":"1045"}]},{"text":"卫浴用品","value":"1049","options":[{"text":"洗漱用品","value":"1053"},{"text":"卫浴配件","value":"1051"},{"text":"卫浴收纳","value":"1052"},{"text":"马桶坐垫","value":"1050"}]},{"text":"塑身美体","value":"1046","options":[{"text":"美体矫正","value":"1048"},{"text":"美容塑形","value":"1047"}]},{"text":"生活电器","value":"1061","options":[{"text":"个护电器","value":"1066"},{"text":"家用电器","value":"1067"},{"text":"手机配件","value":"1068"},{"text":"按摩器","value":"1064"},{"text":"电脑配件","value":"1063"},{"text":"打印投影","value":"1062"},{"text":"车载电器","value":"1065"}]},{"text":"生活日用","value":"238","options":[{"text":"服饰配饰","value":"1069"},{"text":"家居用品","value":"281"},{"text":"收纳用品","value":"1057"},{"text":"家具五金","value":"1055"},{"text":"除湿用品","value":"1054"},{"text":"垃圾袋","value":"1056"},{"text":"玩具","value":"1058"}]},{"text":"文具","value":"239","options":[{"text":"笔","value":"1059"},{"text":"办公用品","value":"282"},{"text":"本/便签","value":"285"},{"text":"办公收纳","value":"1060"}]},{"text":"运动用品","value":"1070","options":[{"text":"乒乓球用品","value":"1071"}]},{"text":"车载用品","value":"988","options":[{"text":"车用收纳","value":"989"},{"text":"汽车美容","value":"991"}]},{"text":"宠物用品","value":"213","options":[{"text":"宠物清洁","value":"993"},{"text":"宠物日用","value":"996"},{"text":"宠物玩具","value":"1000"},{"text":"宠物食品","value":"998"}]}]},{"text":"母婴儿童","value":"240","options":[{"text":"屁屁护理","value":"580","options":[{"text":"纸尿裤","value":"606"},{"text":"湿巾/棉柔巾","value":"608"},{"text":"如厕训练","value":"609"}]},{"text":"宝宝洗护","value":"581","options":[{"text":"洗发沐浴","value":"588"},{"text":"身体护理","value":"589"},{"text":"口腔护理","value":"590"},{"text":"衣物清洁","value":"591"},{"text":"驱蚊/止痒","value":"592"},{"text":"防晒爽身","value":"593"},{"text":"医护用品","value":"594"},{"text":"日用配件","value":"595"},{"text":"洗手液","value":"983"}]},{"text":"喂养用品","value":"582","options":[{"text":"奶瓶奶嘴","value":"633"},{"text":"安抚奶嘴/牙胶","value":"636"},{"text":"水杯水壶","value":"635"},{"text":"筷子/勺叉","value":"639"},{"text":"宝宝餐具","value":"640"},{"text":"奶瓶餐具清洗","value":"642"},{"text":"食物储存","value":"641"},{"text":"围嘴/罩衣","value":"638"},{"text":"配件","value":"643"}]},{"text":"营养辅食","value":"583","options":[{"text":"宝宝辅食","value":"644"}]},{"text":"宝宝玩具","value":"584","options":[{"text":"模型玩具","value":"598"},{"text":"益智玩具","value":"599"},{"text":"过家家玩具","value":"667"},{"text":"电动/遥控玩具","value":"666"},{"text":"戏水玩具","value":"602"},{"text":"早教玩具","value":"664"},{"text":"运动玩具","value":"605"}]},{"text":"童装童鞋","value":"585","options":[{"text":"长袖","value":"612"},{"text":"长裤","value":"616"},{"text":"卫衣","value":"613"},{"text":"内裤","value":"662"},{"text":"宝宝寝具","value":"668"},{"text":"套装","value":"610"},{"text":"短袖","value":"611"},{"text":"外套","value":"617"},{"text":"连体衣","value":"626"},{"text":"背心/马甲","value":"615"},{"text":"羽绒服/棉衣","value":"623"},{"text":"短裤","value":"614"},{"text":"连衣裙/半身裙","value":"618"},{"text":"家居服/睡衣","value":"619"},{"text":"打底裤/袜子","value":"620"},{"text":"帽子/围巾/手套","value":"622"},{"text":"配饰/发饰","value":"625"},{"text":"包包","value":"627"},{"text":"儿童雨具","value":"628"},{"text":"学步鞋","value":"629"},{"text":"休闲鞋/皮鞋","value":"630"},{"text":"儿童凉鞋","value":"631"},{"text":"棉鞋/雪地靴","value":"632"},{"text":"服饰礼盒","value":"669"}]},{"text":"出行装备","value":"587","options":[{"text":"出行装备","value":"596"},{"text":"出行配件","value":"597"}]},{"text":"妈妈专区","value":"244","options":[{"text":"孕妇装","value":"311"},{"text":"祛妊娠纹","value":"309"},{"text":"孕产妇用品","value":"308"},{"text":"产后塑身","value":"653"},{"text":"孕期护理","value":"657"},{"text":"孕期营养","value":"655"},{"text":"文胸/内裤","value":"658"},{"text":"妈咪包/手账包","value":"654"}]}]},{"text":"时尚服饰","value":"353","options":[{"text":"气质女装","value":"839","options":[{"text":"T恤","value":"852"},{"text":"针织衫","value":"855"},{"text":"羽绒服","value":"862"},{"text":"背心","value":"857"},{"text":"风衣","value":"860"},{"text":"大衣","value":"861"},{"text":"毛衣","value":"856"},{"text":"夹克","value":"863"},{"text":"卫衣","value":"854"},{"text":"半裙","value":"865"},{"text":"衬衫","value":"853"}]},{"text":"女士裤装","value":"840","options":[{"text":"休闲裤","value":"869"},{"text":"运动裤","value":"870"},{"text":"短裤","value":"872"},{"text":"阔腿裤","value":"868"},{"text":"哈伦裤","value":"871"},{"text":"工装裤","value":"873"},{"text":"连体裤","value":"874"},{"text":"背带裤","value":"875"},{"text":"牛仔裤","value":"867"}]},{"text":"女士内衣","value":"842","options":[{"text":"文胸","value":"881"},{"text":"内裤","value":"882"},{"text":"内衣套装","value":"883"},{"text":"短袜","value":"887"},{"text":"塑身衣/塑身裤","value":"884"},{"text":"睡衣","value":"885"},{"text":"起居服","value":"886"},{"text":"连裤袜","value":"888"},{"text":"中筒袜","value":"889"}]},{"text":"箱包手袋","value":"843","options":[{"text":"单肩包","value":"359"},{"text":"双肩包","value":"360"},{"text":"化妆包","value":"356"},{"text":"卡包零钱包","value":"564"},{"text":"钱包","value":"545"},{"text":"腰包/胸包","value":"895"},{"text":"斜挎包","value":"893"},{"text":"手拿包","value":"892"},{"text":"旅行箱","value":"570"},{"text":"手提包","value":"891"}]},{"text":"时尚饰品","value":"845","options":[{"text":"耳饰","value":"902"},{"text":"项链","value":"904"},{"text":"手链/手镯","value":"905"},{"text":"戒指","value":"906"}]},{"text":"服饰配件","value":"846","options":[{"text":"渔夫帽","value":"909"},{"text":"棒球帽","value":"547"},{"text":"鸭舌帽","value":"910"},{"text":"针织帽","value":"536"},{"text":"贝雷帽","value":"549"},{"text":"报童帽","value":"551"},{"text":"礼帽","value":"911"},{"text":"围巾丝巾","value":"544"},{"text":"手套","value":"542"}]},{"text":"时尚女鞋","value":"850","options":[{"text":"休闲鞋","value":"957"},{"text":"小白鞋","value":"944"},{"text":"乐福鞋","value":"935"},{"text":"穆勒鞋","value":"937"},{"text":"粗跟鞋","value":"938"},{"text":"细跟鞋","value":"939"},{"text":"芭蕾舞鞋","value":"940"},{"text":"跑步鞋","value":"942"},{"text":"短靴","value":"949"},{"text":"拖鞋","value":"945"},{"text":"猫跟鞋","value":"948"},{"text":"凉鞋","value":"943"},{"text":"帆布鞋","value":"936"}]},{"text":"精致腕表","value":"848","options":[{"text":"机械腕表","value":"919"},{"text":"石英腕表","value":"920"},{"text":"智能腕表","value":"921"}]},{"text":"品质男鞋","value":"851","options":[{"text":"皮鞋","value":"958"},{"text":"运动鞋","value":"959"}]},{"text":"眼镜配件","value":"847","options":[{"text":"太阳镜","value":"916"},{"text":"光学眼镜","value":"917"}]}]},{"text":"成人用品","value":"695","options":[{"text":"安全避孕","value":"696","options":[{"text":"超薄","value":"699"},{"text":"纹理","value":"701"},{"text":"特别款","value":"704"}]},{"text":"润滑用品","value":"697","options":[{"text":"水溶性","value":"705"},{"text":"特殊款","value":"706"}]},{"text":"情趣用品","value":"698","options":[{"text":"飞机杯","value":"707"},{"text":"震动棒","value":"708"},{"text":"跳蛋","value":"709"},{"text":"情趣内衣","value":"710"},{"text":"其他","value":"711"}]}]}] 
				}
			});
		}, 15000);
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
	
	app.post('/ajaxUpload', (req,res)=>{
		
		up(req, res, function(err){
			if (err) {
				res.json({
					errno: 10010,
					errmsg: err.message
				});
			}else{
				let oriName = req.file.originalname;
				let path = req.file.path;
				let newPath = path.replace(/[^/]+?$/, oriName);
				if(fs.existsSync(newPath))
					fs.unlinkSync(newPath);
				fs.renameSync(path, newPath);
				res.json({
					errno: 0,
					data: {
						src: '/upload/'+oriName
					}
				});
			}
		});
	});
};