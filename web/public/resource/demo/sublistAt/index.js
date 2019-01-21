STable.init({
	title: 'groupBy',
	url: '/demo/ajaxList?sublist_demo=1',
	params: {
		count: 40,
		page: 5
	},
	rowNumberVisible: true,
	sublistAt: 'movieType',
	columns: [
		{
			header: 'id',
			dataIndex:'id',
			width: 100,
			locked: true,
			sortable: true
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
		},
		{
			header: '国家',
			dataIndex: 'locationName',
			width: 80
		},
		{
			header: '上映时间',
			dataIndex: 'year',
			width: 80
		},
		{
			header: '影片类型',
			dataIndex: 'movieType',
			width: 150
		}
	]
});