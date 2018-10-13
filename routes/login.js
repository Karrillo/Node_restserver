const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const jwt = require('jsonwebtoken');

const app = express();


//Login
app.post('/login', (req, res) => {

    let body = req.body;

    // Find user on data base
    User.findOne({ email: body.email }, (err, userSB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Find email on data base
        if (!userSB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'User incorrect'
                }
            });
        }

        // Find password on database
        if (!bcrypt.compareSync(body.password, userSB.password)) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Password incorrect'
                }
            });
        } else {

            //Create Token
            let token = jwt.sign({
                user: userSB
            }, process.env.SEED, { expiresIn: process.env.TOKEN });

            res.json({
                ok: true,
                user: userSB,
                token
            });
        }

    });
});

module.exports = app;