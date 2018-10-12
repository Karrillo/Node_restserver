const express = require('express');
const app = express();

const mongoose = require('mongoose');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(require('../routes/users'));

require('./config/config');

//Connections
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log("Connected to the DB");
});

app.listen(process.env.PORT, () => {
    console.log(`Server on port: ${process.env.PORT}`);
});