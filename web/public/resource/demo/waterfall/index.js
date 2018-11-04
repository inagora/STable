const type = ["剧情", "喜剧", "短片", "爱情", "纪录片", "动作", "惊悚", "恐怖", "动画", "犯罪", "冒险", "家庭", "悬疑", "奇幻", "科幻", "战争", "传记", "音乐", "历史", "歌舞", "西部", "运动", "古装", "武侠", "戏曲", "黑色电影", "儿童", "新闻", "真人秀", "舞台艺术", "成人", "脱口秀", "游戏秀", "情色", "文艺", "同性", "女性", "青春", "励志", "微电影", "灾难"];
STable.init({
	pageMode: 'waterfall',
	pageIndex: 'id',
	title: '一个标准的Demo',
	tip: '<div style="color:red">🍭Demo中所有数据来时光网，如有侵权，会立即删除</div>',
	url: '/demo/ajaxWaterfall',
	params: {
		count: 30
	},
	rowNumberVisible: true,
	searchFilter: [
		{
			label: '名字',
			name: 'name'
		},
		{
			name: 'movieType',
			label: '影片类型',
			list: type
		},
		{
			label: '上映时间(起)',
			name: 'stime',
			type: 'date'
		},
		{
			label: '上映时间(终)',
			name: 'etime',
			type: 'date'
		}
	],
	ignoreEmptySearchParam: true,
	downloadable: true,
	toolbar: [
		{
			text: '买票',
			click(){
				console.log(this.getSelectedRows());
			}
		},
		{
			text: '下架电影',
			icon: 'el-icon-circle-close',
			type: 'danger',
			click(){
				console.log(this.getSelectedRows())
			}
		}
	],
	sortKey: 'id',
	sortDirection: 'desc',
	columns: [
		{
			header: 'id',
			dataIndex:'id',
			width: 100,
			locked: true,
			sortable: true
		},
		{
			header: '海报',
			dataIndex: 'img',
			width: 120,
			render(record){
				let img = record.img;
				return `<div class="poster" style="background-image:url(${img.replace(/_\d+X\d+(X2)?\.jpg/,'_640X360X2.jpg')})"></div>`;
			}
		},
		{
			header: '名字',
			dataIndex: 'name',
			width: 200,
			cellWrap: true
		},{
			header: '评分',
			dataIndex: 'rating',
			width: 100,
			fx: 'average',
			sortable: true
		},{
			header: '影片类型',
			dataIndex: 'movieType',
			width: 150
		},
		{
			header: '导演',
			dataIndex: 'directors',
			width: 150,
			render(record){
				return record.directors.join(' | ');
			}
		},{
			header: '主演',
			dataIndex: 'actors',
			cellWrap: true,
			width: 150,
			render(record){
				return record.actors.join(' | ');
			}
		},
		{
			header: '国家',
			dataIndex: 'locationName',
			width: 80
		},{
			header: '上映时间',
			dataIndex: 'year',
			width: 80
		},{
			header: '其它名字',
			width: 500,
			cellWrap: true,
			dataIndex: 'titleOthersCn',
			render(record){
				return record.titleOthersCn.join(' | ');
			}
		}
	],
	selectMode: 'multiple',
	listeners: {
		cellclick(record, col) {
			if(col.dataIndex=='img') {
				let img = record.img;
				Dialog.create({
					width: '90%',
					height: '90%',
					autoShow: true,
					html: `<a href="${img}" target="_blank"><div style="width:100%;height: 100%;background:url(${img}) no-repeat center;background-size:contain;"></div></a>`
				});
			}
		}
	},
});