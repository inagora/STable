module.exports = {
	title: 'STable - Focus on table',
	description: 'A tool focuses on the table',
	evergreen: true,
	base: '/STable/',
	locales: {
		'/en/': {
			lang: 'en-US',
			title: 'STable - Focus on table',
			description: 'A tool focus on the table'
		},
		'/zh/': {
			lang: 'zh-CN',
			title: 'STable - 专注于表格',
			description: '一个专注于web表格展示的工具'
		},
		'/v1/': {
			lang: 'zh-CN',
			title: 'STable - 专注于表格',
			description: '一个专注于web表格展示的工具'
		}
	},
	themeConfig: {
		sidebarDepth: 3,
		locales: {
			'/zh/': {
				sidebar: [
					'/zh/guide/install',
					'/zh/guide/first_stable',
					'/zh/api'
				]
			},
			'/en/': {
				sidebar: [
					'/en/guide/install',
					'/en/guide/first_stable',
					'/en/api'
				]
			},
			'/v1/': {
				sidebar: [
					'/v1/guide/install',
					'/v1/guide/first_stable',
					'/v1/api'
				]
			},
		},
		nav: [
			{ 
				text: '版本',
				items: [
					{
						text: '2.0.3',
						link: '/zh/guide/install.html'
					},
					{
						text: '1.x',
						link: '/v1/guide/install.html'
					}
				]
			},
		]
	}
};