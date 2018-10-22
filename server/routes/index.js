const express = require('express');
const app = express();

//Routes
app.use(require('./login'));
app.use(require('./users'));
app.use(require('./products'));
app.use(require('./clients'));
app.use(require('./upload'));
app.use(require('./images'));

module.exports = app;