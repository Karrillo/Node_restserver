const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Config Google
async function verify(token) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });

    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
};


app.post('/google', async(req, res) => {

    let token = req.body.idToken;

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err: err
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (userDB) {

            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'You must use your normal authentication'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: userDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN });


                return res.json({
                    ok: true,
                    user: userDB,
                    token,
                });

            }

        } else {

            // if the user was not found on DB
            let user = new User();

            user.name = googleUser.nombre;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = ':)';


            user.save((err, userDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN });

                return res.json({
                    ok: true,
                    user: userDB,
                    token,
                });

            });
        }
    });

});

module.exports = app;