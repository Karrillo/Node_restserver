const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const { verifyToken, verifyRol } = require('../middlewares/autentication');

const app = express();

//Get Users
app.get('/users', verifyToken, function(req, res) {

    let page = req.query.page || 0;
    page = Number(page);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ state: true }, 'name email role state google img')
        .skip(page)
        .limit(limit)
        .exec((err, userDB) => {

            if (err) {

                return res.status(400).json({
                    ok: false,
                    err
                });

            }

            User.count({ state: true }, (err, count) => {

                res.json({
                    ok: true,
                    user: userDB,
                    count: count
                });

            });
        });
});


//Create User
app.post('/user', function(req, res) {

    let body = req.body;

    let user = new User({

        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });

    user.save((err, userDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err

            });

        }

        //userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        });

    });
});


//Edit User
app.put('/user/:id', [verifyToken, verifyRol], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        }

        if (!userDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'user not found'
                }
            });

        }

        res.json({
            ok: true,
            user: userDB
        });

    });
});


//Delete User
app.delete('/user/:id', [verifyToken, verifyRol], function(req, res) {

    let id = req.params.id;
    let _state = {
        state: false
    };

    User.findByIdAndUpdate(id, _state, { new: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }

        if (!userDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'user not found'
                }
            });

        }

        res.json({
            ok: true,
            user: userDB
        });

    });
});



module.exports = app;