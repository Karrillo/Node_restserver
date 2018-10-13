const express = require('express');
const app = express();

//Routes
app.use(require('./login'));
app.use(require('./users'));

module.exports = app;