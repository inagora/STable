const path = require('path');
const fs = require('fs');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

console.log('清空文件');
fs.writeFileSync(
	path.resolve(__dirname, '../dist/STable.min.css'),
	'',
	'utf8'
);
fs.writeFileSync(
	path.resolve(__dirname, '../dist/STable.min.js'),
	'',
	'utf8'
);
module.exports = function(env, argv) {
	let mode = argv.mode=='development' ? 'development' : 'production';
	let isDev = mode=='development';
	let output = {
		path: path.resolve(__dirname, '../dist'),
		filename: 'STable.min.js',
		library: 'STable',
		libraryTarget: 'window'
	};

	let config = {
		entry: {
			STable: './dev-src/index'
		},
		mode,
		output,
		devtool: isDev? "eval-source-map":'none',
		resolve: {
			extensions: [".js", ".vue", ".json"],
			modules: [
				path.resolve(__dirname, '../dev-src'),
				path.resolve(__dirname, '../node_modules')
			]
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					use: 'vue-loader'
				},
				{
					test: /\.js$/,
					use: 'babel-loader',
					exclude: /node_modules/
				},
				{
					test: /\.css$/,
					use: [
						isDev ? 'vue-style-loader': MiniCssExtractPlugin.loader,
						'css-loader'
					]
				}
			]
		},
		plugins: [
			new VueLoaderPlugin(),
			new MiniCssExtractPlugin({
				filename: 'STable.min.css'
			})
		]
	};
	//生产模式下，
	if(!isDev) {

	}
	return config;
};