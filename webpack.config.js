const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
module.exports = function(options, args) {
	let isProd = args && args.mode=='production' || false;
	let conf = {
		entry: ['./src/js/index.js'],
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'STable.min.js',
			library: 'STable',
			libraryTarget: 'window',
			publicPath: '/resource/module/STable/'
		},
		devtool: isProd? 'none':'inline-source-map',
		resolve: {
			modules: [
				path.resolve(__dirname, 'src'),
				path.resolve(__dirname, 'node_modules')
			],
			alias: {
				'~': path.resolve(__dirname, 'src'),
				'vue$': 'vue/dist/vue.esm.js'
			},
			extensions: [".js", ".vue", ".json"]
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
						MiniCssExtractPlugin.loader,
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
	if(isProd) {
		conf.optimization = {
			minimizer: [
				new OptimizeCSSAssetsPlugin({})
			]
		};
		conf.plugins.push(new MinifyPlugin()); 
	}
	return conf;
};