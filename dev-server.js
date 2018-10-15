const open = require("open");
const koaWebpack = require('koa-webpack');
const webpack = require('webpack');
const config = require('./webpack.config.js')();
const compiler = webpack(config);
const appInit = require('./web/server.js');

koaWebpack({compiler}).then(middleware => {
	appInit(middleware);
	open("http://localhost:3000/resource/html/dev.html");
});