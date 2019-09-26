module.exports = {
	title: 'STable - Focus on table',
	description: 'A tool focuses on the table',
	evergreen: true,
	locales: {
		'/en/': {
			lang: 'english',
			title: 'STable - Focus on table',
			description: 'A tool focus on the table'
		},
		'/zh/': {
			lang: '中文',
			title: 'STable - 专注于表格',
			description: '一个专注于web表格展示的工具'
		}
	},
	themeConfig: {
		sidebarDepth: 3,
		locales: {
			'/zh/': {
				sidebar: [
					'/zh/api/',
					'/zh/api/com'
				]
			},
			'/en/': {
				sidebar: [
					'/en/api/',
					'/en/api/com'
				]
			}
		}
	},
	plugins: [
		require('./patch_code.js')
	]
};