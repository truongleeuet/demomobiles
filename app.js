/**
 * Created by Admin on 2/29/2016.
 */
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var app = express();
var login = require('./routes/login');
var index = require('./routes/index');
var inpage = require('./routes/inpage');
var top = require('./routes/top_banner');
var bigArticle = require('./routes/bigArticle');
var popup = require('./routes/popup');
var results = require('./routes/results');

//app.set('views' , './views');
//app.set('view engine', 'ejs');

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static('public'));
app.use(express.static('src/views'));
//app.use(express.static('routes'));

app.use('/', index);
app.use('/login', login);
app.use('/inpage', inpage);
app.use('/top', top);
app.use('/bigArticle', bigArticle);
app.use('/popup', popup);
app.use('/results', results) ;
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
