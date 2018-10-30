const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
module.exports = function(options, args) {
	let isProd = args && args.mode=='production' || false;
	let output = {
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/resource/module/STable/'
	};
	if(isProd) {
		output.filename = '[name].min.js';
	} else {
		output.filename = 'STable.min.js';
		output.library = 'STable';
		output.libraryTarget = 'window';
	}
	let conf = {
		entry: isProd ? 
			{
				'STable': './src/js/STable.js',
				'STable.full': './src/js/STable.full.js',
				//'pinyin': './src/js/pinyin.js'
			}
			:
			['./src/js/index.js'],
		output,
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
				},
				{
					test: /\.(ttf|woff|woff2)(\?.+)?$/,
					use: [{
						loader: 'url-loader',
						options: {
							limit: 10000
						}
					}]
				}
			]
		},
		plugins: [
			new VueLoaderPlugin(),
			new MiniCssExtractPlugin({
				filename: isProd ? '[name].min.css' : 'STable.min.css'
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