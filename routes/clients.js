const express = require('express');
const Client = require('../models/person');
const { verifyToken } = require('../middlewares/autentication');

const app = express();

app.get('/clients', verifyToken, function(req, res) {

    let page = req.query.page || 0;
    page = Number(page);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    Client.find({ state: true })
        .populate('user')
        .sort('name')
        .skip(page)
        .limit(limit)
        .exec((err, clientDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Client.count({ state: true }, (err, count) => {
                res.json({
                    ok: true,
                    clients: clientDB,
                    count: count
                });
            });
        });
});

app.get('/client/:id', verifyToken, function(req, res) {

    let id = req.param.id;

    Client.findById(id, (err, clientDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!clientDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'client not found'
                }
            });
        }

        res.json({
            ok: true,
            client: clientDB,
        });
    });
});

app.get('/clients/search/:word', verifyToken, function(req, res) {

    let word = req.param.word;

    let regex = new RegExp(word, 'i');

    Client.find({ name: regex, state: true })
        .populate('user')
        .exec((err, clientDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                client: clientDB
            });
        });
});

app.post('/client', verifyToken, function(req, res) {

    let client = new Client();
    client = req.body;

    client.save((err, clientDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            client: clientDB
        });

    });

});

app.put('/client/:id', verifyToken, function(req, res) {

    let id = req.param.id;

    let client = new Client();
    client = req.body;

    Client.findByIdAndUpdate(id, client, (err, clientDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!clientDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'client not found'
                }
            });
        }

        res.json({
            ok: true,
            client: clientDB
        });

    });

});

app.delete('/client/:id', verifyToken, function(req, res) {

    let id = req.param.id;

    let _state = {
        state: false
    };

    Client.findByIdAndUpdate(id, _state, (err, clientDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!clientDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'client not found'
                }
            });
        }

        res.json({
            ok: true,
            client: clientDB
        });
    });
});

module.exports = app;