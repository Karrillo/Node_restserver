//Connections
require('./config/config');

//Dependencies
const express = require('express');
const mongoose = require('mongoose');

const app = express();


mongoose.set('useCreateIndex', true);

//Middlewares
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Routes
app.use(require('../routes/index'));

//Connections Data Base
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log("Connected to the DB");
});

//Connections Port
app.listen(process.env.PORT, () => {
    console.log(`Server on port: ${process.env.PORT}`);
});