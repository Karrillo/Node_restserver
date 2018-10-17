//Port
process.env.PORT = process.env.PORT || 8080;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Data Base
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/test';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;

//Token
process.env.TOKEN = '1h';
//Seed
process.env.SEED = process.env.SEED || 'secret';

//Google Client
process.env.CLIENT_ID = process.env.CLIENT_ID || '991459890147-ejae2dphae0ch5ujc9rarfh3v1jqtjgf.apps.googleusercontent.com';