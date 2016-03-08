/**
 * Created by Admin on 3/8/2016.
 */
var express = require('express');
var routerInpage = express.Router();
var path = require('path');

routerInpage.get('/', function(req, res, next) {
    res.render(path.resolve(__dirname, '../src/views/inpage/inpage.ejs'))
});

routerInpage.post('/upload_inpage', function(req, res, next) {
    //get Image Vertical
    var imgVertical = req.body.
})

module.exports = routerInpage;