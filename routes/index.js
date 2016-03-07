/**
 * Created by Admin on 3/3/2016.
 */
var express = require('express');
var path = require('path');
var routerIndex = express.Router();

routerIndex.get('/', function(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../src/views/popup_ver1.html'))
});

routerIndex.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
})

module.exports = routerIndex;