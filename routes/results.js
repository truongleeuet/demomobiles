/**
 * Created by Admin on 3/15/2016.
 */
var express = require('express');
var routes = express.Router();
var path = require('path');

routes.get('/', function(req, res, next) {
    res.render(path.resolve(__dirname, '../src/views/results'));
});

module.exports = routes;