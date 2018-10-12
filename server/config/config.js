process.env.PORT = process.env.PORT || 8080;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/test';
} else {
    urlDB = 'mongodb://test:v2649315x@ds129823.mlab.com:29823/tests';
}

process.env.URLDB = urlDB;