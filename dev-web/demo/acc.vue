<template>
	<div id="box"></div>
</template>

<script>
STable.init({
	el: '#box',
	url: '/ajaxList',
	columns: [
		{
			dataIndex: 'name',
			header: 'move name'
		},
		{
			dataIndex: 'movieType',
			header: 'type'
		},
		{
			dataIndex: 'img',
			header: 'poster'
		}
	],
	acc: {
		movieType: {
			width: 200
		},
		img: {
			render(record){
				return `<img style="max-height:50px" src="${record.img}"/>`
			}
		}
	}
});
</script>

<style>
#box{
	height: 300px;
}
</style>
