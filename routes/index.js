const express = require('express');
const app = express();

//Routes
app.use(require('./login'));
app.use(require('./users'));
app.use(require('./products'));
app.use(require('./clients'));

module.exports = app;