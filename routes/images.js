const express = require('express');

const fs = require('fs');
const path = require('path');

const { verifyToken, verifyTokenImg } = require('../middlewares/autentication');

const app = express();

app.get('/images/:type/:img', verifyTokenImg, function(req, res) {

    let type = req.params.type;
    let img = req.params.img;

    let pathImage = path.resolve(__dirname, `../uploads/${type}/${img}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        let noImagePath = path.resolve(__dirname, '../server/assets/no-image.jpg');
        res.sendFile(noImagePath);
    }
});

module.exports = app;