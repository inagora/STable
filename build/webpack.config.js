const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
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
	let mode = (argv&&argv.mode)||process.env.NODE_ENV;
	mode = mode=='development' ? 'development' : 'production';
	let isDev = mode=='development';
	let output = {
		path: path.resolve(__dirname, '../dist'),
		filename: 'STable.min.js',
		library: 'STable',
		libraryTarget: 'window',
		publicPath: '/'
	};

	let plugins = [
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: 'STable.min.css'
		})
	];

	//热替换
	let devServer = {};
	if(argv.usehmr) {
		let dServer = require('../dev-web/devServer');
		Object.assign(devServer, {
			hot: true,
			hotOnly:true,
			open: true,
			contentBase: path.resolve(__dirname, '../dev-web'),
			before: function(app, server) {
				dServer(app, server);
			}
		});

		plugins.push(new webpack.HotModuleReplacementPlugin());
	}

	let config = {
		entry: {
			STable: './dev-src/index'
		},
		devServer,
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
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /node_modules|form\/|Form.vue/
				},
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
				},
				{
					test: /\.scss$/,
					use: [
						isDev ? 'vue-style-loader': MiniCssExtractPlugin.loader,
						'css-loader',
						'sass-loader'
					]
				}
			]
		},
		plugins
	};
	//生产模式下，
	if(!isDev) {

	}
	return config;
};