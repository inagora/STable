const koaWebpack = require('koa-webpack');
const webpack = require('webpack');
const config = require('./webpack.config.js')();
const compiler = webpack(config);
const appInit = require('./web/server.js');

koaWebpack({compiler}).then(middleware => {
	appInit(middleware);
});