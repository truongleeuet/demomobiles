/**
 * Created by Admin on 3/8/2016.
 */
var express = require('express');
var multer = require('multer');
var routerInpage = express.Router();
var path = require('path');
var crypto = require('crypto');
var mime = require('mime');

//routerInpage.get('/', function(req, res, next) {
//    res.render(path.resolve(__dirname, '../src/views/inpage/inpage.ejs'))
//});

routerInpage.get('/', function(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../src/views/upload.html'))
});
//console.log(multer,'11111111111111');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/images/inpage/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname );
    }
})
var upload = multer({ storage: storage })

routerInpage.post('/upload_inpage', upload.any(), function(req, res, next) {
    var file = req.files;
    res.send(file);
});

routerInpage.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.render('error', {
        message: err.message,
        error: err
    })
})

module.exports = routerInpage;