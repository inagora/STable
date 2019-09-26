const express = require('express');
const path = require('path');
let dServer = require('./devServer');
const app = express()
const port = 3000
dServer(app);
app.use(express.static(__dirname));
app.use(express.static(path.resolve(__dirname, '../dist/')));
app.listen(port, () => console.log(`Example app listening on port ${port}!`))