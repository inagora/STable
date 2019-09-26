STable.init({
	el: '#box',
	title: '测试用例',
	titleVisible: true,
	url: '/ajaxList',
	columns: [
		{
			header: 'id',
			dataIndex:'id',
			width: 100,
			locked: true,
			sortable: true
		},
		// {
		// 	header: '海报',
		// 	dataIndex: 'img',
		// 	width: 120,
		// 	render(record){
		// 		let img = record.img;
		// 		return `<div class="poster" style="background-image:url(${img.replace(/_\d+X\d+(X2)?\.jpg/,'_640X360X2.jpg')})"></div>`;
		// 	}
		// },
		{
			header: '名字',
			dataIndex: 'name',
			width: 200,
			cellWrap: true,
			style: {
				color: 'green'
			},
			cls: 'lalala'
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
			width: 250,
			render(record){
				return record.directors.join(' | ');
			}
		},{
			header: '主演',
			dataIndex: 'actors',
			cellWrap: true,
			width: 250,
			render(record){
				return record.actors.join(' | ');
			}
		},
		{
			header: '国家',
			dataIndex: 'locationName',
			width: 280
		},{
			header: '上映时间',
			dataIndex: 'year',
			width: 280,
			locked: 'right'
		}
		// ,{
		// 	header: '其它名字',
		// 	width: 500,
		// 	cellWrap: true,
		// 	dataIndex: 'titleOthersCn'
		// }
	],
	
	componentOrder: [
		'title', 'table','toolbar', 'search'
	]
});