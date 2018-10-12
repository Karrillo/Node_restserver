const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

require('./config/config');

app.get('/user', (req, res) => {
    res.json('hola');
});

app.post('/user', (req, res) => {

    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: 'El nombre es necesario'
        });
    } else {
        res.json({
            user: body
        });
    }
});

app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;
    res.json('');
});

app.delete('/user/:id', (req, res) => {
    let id = req.params.id;
    res.json('');
});

app.listen(process.env.PORT, () => {
    console.log(`Server on port: ${process.env.PORT}`);
});