const jwt = require('jsonwebtoken');

//Token
let verifyToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {

            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token is invalid'
                }
            });

        }

        req.user = decoded.user;
        next();

    });
};

//Img
let verifyTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {

            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token is invalisd'
                }
            });

        }

        req.user = decoded.user;
        next();

    });
};

//Admin user
let verifyRol = (req, res, next) => {

    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {

        next();

    } else {

        return res.status(401).json({
            ok: false,
            err: {
                message: 'The user is not an administrator'
            }
        });

    }
};

module.exports = { verifyToken, verifyRol, verifyTokenImg };