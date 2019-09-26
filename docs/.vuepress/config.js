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
		}
	},
	themeConfig: {
		sidebarDepth: 3,
		locales: {
			'/zh/': {
				sidebar: [
					'/zh/api'
				]
			},
			'/en/': {
				sidebar: [
					'/en/api'
				]
			}
		}
	}
};