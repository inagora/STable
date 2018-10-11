const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function(options, args) {
	console.log(args.mode);
	return {
		entry: './src/js/index.js',
		output: {
			path: args.mode=='development' ? path.resolve(__dirname, 'web/public/resource/module/STable'): path.resolve(__dirname, 'dist'),
			filename: 'STable.min.js',
			library: 'STable',
			libraryTarget: 'window'
		},
		module: {
			rules: [{
				test: /\.vue$/,
				use: [{
					loader: 'vue-loader'
				}]
			}, {
				test: /\.js$/,
				use: ['babel-loader'],
				exclude: /node_modules/
			}, {
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader'
				]
			}, {
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,//'vue-style-loader',
					'css-loader',
					'sass-loader'
				]
			}, 
			{
				test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 10000,
						name: './[name].[ext]?[hash]'
					}
				}]
			}
		]
		},
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
		plugins: [
			new VueLoaderPlugin(),
			new MiniCssExtractPlugin({
				filename: 'STable.min.css'
			})
		],
		devtool: args.mode == 'production' ? 'none' : 'eval-source-map'
	};
};