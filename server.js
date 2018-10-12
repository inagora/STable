const path = require('path');
const Koa = require('koa');
const koaWebpack = require('koa-webpack');
const webpack = require('webpack');
const config = require('./webpack.config.js')();
const app = new Koa();
const compiler = webpack(config);
const serve = require('koa-static');

koaWebpack({compiler}).then(middleware => {
	app.use(serve(path.resolve(__dirname, 'src/test/public')));
	app.use(middleware);
	app.listen(3000);
});