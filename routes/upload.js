const express = require('express');
const fileUpload = require('express-fileupload');

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

const app = express();

app.use(fileUpload());

//Method Upload Image
app.put('/upload/:type/:id', function(req, res) {

    let type = req.params.type;
    let id = req.params.id;

    //Find file
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'not img found'
            }
        });
    }

    //Validate type
    let typeValidate = ['products', 'users'];
    if (typeValidate.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'The allowed types are: ' + typeValidate.join(', '),
            }
        });
    }

    //Validate extension
    let simpleFile = req.files.simpleFile;

    let nameFile = simpleFile.name.split('.');
    let extensionsFiles = ['png', 'jpg', 'gif', 'jpeg'];
    let extension = nameFile[nameFile.length - 1];

    if (extensionsFiles.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'The allowed extension are: ' + extensionsFiles.join(', '),
                ext: extension
            }
        });
    }

    //Name file
    let name = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //Save File
    simpleFile.mv(`uploads/${type}/${name}`, function(err, res) {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Image
        if (type === 'users') {
            imgUser(id, res, name);
        } else {
            imgProduct(id, res, name);
        }

    });
});

//Images for Users 
function imgUser(id, res, name) {

    User.findById(id, (err, userDB) => {
        if (err) {

            deleteFile(name, 'users');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {

            deleteFile(name, 'users');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        deleteFile(userDB.img, 'users');

        userDB.img = name;

        User.save((err, userSave) => {
            res.join({
                ok: true,
                user: userSave,
                img: name
            });
        });
    });
}

//Images for Products 
function imgProduct(id, res, name) {

    Product.findById(id, (err, productDB) => {
        if (err) {

            deleteFile(name, 'products');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {

            deleteFile(name, 'products');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Product not found'
                }
            });
        }

        deleteFile(productDB.img, 'products');

        productDB.img = name;

        User.save((err, productSave) => {
            res.join({
                ok: true,
                user: productSave,
                img: name
            });
        });
    });
}


//Delete Images
function deleteFile(nameImg, type) {

    let pathImg = path.resolve(__dirname, `../uploads/${type}/${nameImg}`);

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;