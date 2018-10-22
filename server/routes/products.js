const express = require('express');
const Product = require('../models/product');
const { verifyToken } = require('../middlewares/autentication');

const app = express();

app.get('/products', verifyToken, function(req, res) {

    let page = req.query.page || 0;
    page - Number(page);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    Product.find({ state: true })
        .populate('user')
        .populate('client', 'name businessName')
        .sort('code')
        .skip(page)
        .limit(limit)
        .exec((err, productDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Product.count({ state: true }, (err, count) => {
                res.json({
                    ok: true,
                    product: productDB,
                    count: count
                });
            });
        });
});

app.get('/product/:id', verifyToken, function(req, res) {

    let id = req.param.id;

    Client.findById(id, (err, productDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            product: productDB,
        });
    });
});

app.get('/products/search/:word', verifyToken, function(req, res) {

    let word = req.param.word;

    let regex = new RegExp(word, 'i');

    Client.find({ name: regex, state: true })
        .populate('user')
        .populate('client', 'name businessName')
        .exec((err, productDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                product: productDB
            });
        });
});

app.post('/product', verifyToken, function(req, res) {

    let client = new Client();
    client = req.body;

    client.save((err, productDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            product: productDB
        });
    });

});

app.put('/product/:id', verifyToken, function(req, res) {

    let id = req.param.id;

    let client = new Client();
    client = req.body;

    Product.findByIdAndUpdate(id, client, (err, productDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'product not found'
                }
            });
        }

        res.json({
            ok: true,
            product: productDB
        });
    });
});

app.delete('/product/:id', verifyToken, function(req, res) {

    let id = req.param.id;
    let _state = {
        state: false
    };

    Product.findByIdAndUpdate(id, _state, (err, productDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'product not found'
                }
            });
        }

        res.json({
            ok: true,
            product: productDB
        });
    });
});

module.exports = app;