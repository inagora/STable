const path = require('path');
const fs = require('fs');
const MinifyPlugin = require("babel-minify-webpack-plugin");
module.exports = function(options, args) {
	let files = fs.readdirSync(path.resolve(__dirname, '../src/lang'));
	let entry = {};
	for(let file of files) {
		let fname = path.basename(file, '.js');
		entry[fname] = './src/lang/'+file;
	}
	let conf = {
		entry,
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, '../dist/lang'),
			publicPath: '/resource/module/STable/lang',
			library: ["STable", 'lang', "[name]"],
			libraryTarget: "umd"
		},
		devtool: 'none',
		resolve: {
			modules: [
				path.resolve(__dirname, 'src'),
				path.resolve(__dirname, 'node_modules')
			],
			extensions: [".js", ".json"]
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					use: 'babel-loader',
					exclude: /node_modules/
				}
			]
		},
		//plugins:[new MinifyPlugin()]
	};
	return conf;
};