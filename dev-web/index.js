const express = require('express');
const path = require('path');
let dServer = require('./devServer');
const app = express()
const port = 3001
dServer(app);
app.listen(port);