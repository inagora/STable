const path = require('path');
module.exports = {
	title: 'STable',
	description: '一个用于表格展示和数据处理的组件',
	dest: path.resolve(__dirname, '../../web/public/doc'),
	markdown: {
		lineNumber: true
	},
	themeConfig: {
		nav: [
			{
				text: '指南',
				link: '/guide/install'
			},
			{
				text: '配置',
				link: '/config/'
			},{
				text: 'Examples',
				link: '/resource/html/demo.html'
			},{
				text: 'Github',
				link: 'https://github.com/inagora/STable'
			}
		],
		sidebar: {
			'/guide/': [
				'',
				'install',
				'request',
				'column_width',
				'search_params',
				'dialog_vue',
				'progressbar',
				'fq'
			],
			'/config/': [
				'',
				'column',
				'form',
				'button',
				'method',
				'dialog',
				'side_panel',
				'progressbar'
			]
		}
	}
};