module.exports = {
	title: 'STable',
	description: '一个用于方便展示和处理数据的组件',
	markdown: {
		lineNumber: true
	},
	themeConfig: {
		nav: [
			{
				text: '指南',
				link: '/guide/'
			},
			{
				text: '配置',
				link: '/config/'
			},{
				text: 'Demo',
				link: '/html/demo.html'
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
				'dialog_vue'
			],
			'/config/': [
				'',
				'column',
				'form',
				'button',
				'method',
				'dialog',
				'side_panel'
			]
		}
	}
};