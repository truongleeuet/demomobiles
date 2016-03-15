/**
 * Created by Admin on 3/8/2016.
 */
var express = require('express');
var multer = require('multer');
var routerInpage = express.Router();
var path = require('path');
var crypto = require('crypto');
var mime = require('mime');
var fs = require('fs');

//routerInpage.get('/', function(req, res, next) {
//    res.render(path.resolve(__dirname, '../src/views/inpage/inpage.ejs'))
//});
var fileName = '';
routerInpage.get('/', function(req, res, next) {
    res.render(path.resolve(__dirname, '../src/views/inpage/inpage'));
});
var title = '';
//console.log(multer,'11111111111111');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        title = req.body.title.replace(/\s/g, '_');
        fileName = './public/uploads/images/inpage/' + title ;
        fs.mkdir(fileName, function(err) {
            if(err) {
                console.error(err);
            }
            cb(null, fileName);
        })

    },
    filename: function(req, file, cb) {
        cb(null, file.originalname );
    }
})
var upload = multer({ storage: storage })

routerInpage.post('/upload_inpage', upload.any(), function(req, res, next) {
    var file = req.files;

    var content = 'var mbzone8870 = new zoneM(8870, {'+
    '"html": "",'+
    '"css": "",'+
    '"type": "14",'+
    '"mobilead":1,'+
    '"df": []'+
    '});'+
    'mbzone8870.addBanners({'+
    '"cpc": [],'+
    '"cpm": ['+
    '{'+
    '"id": "267453",'+
    '"cid": "1047556",'+
    '"src": "' + file[0].originalname + '",'+
    '"title": "Tâm bình",'+
    '"content": "",'+
    '"link": "'+ req.body.desUrl +'",'+
    '"type": "14",'+
    '"os": "",'+
    '"os_v": "",'+
    '"dv_t": "",'+
    '"dv_m": "",'+
    '"br": "",'+
    '"br_v": "",'+
    '"l": "",'+
    '"la": "",'+
    '"statustext": "",'+
    '"cpa": "0",'+
    '"buttonnote": "",'+
    '"moblocation": "0",'+
    '"provider": "",'+
    '"link3rd": "",'+
    '"clk_call": "",'+
    '"ispopup": "0",'+
    '"color": "",'+
    '"blogo": "'+ file[1].originalname+'",'+
    '"bname": "",'+
    '"view": "0",'+
    '"download": 0,'+
    '"star": 0,'+
    '}]'+
    '});';

    var site = req.body.slcBanner;

    switch(site) {
        case 0:
            site = './public/site/page_inpage/dantri.html';
            break;
        case 1:
            site = './public/site/page_inpage/kenh14.html';
            break;
        case 2:
            site = './public/site/page_inpage/afamily.html';
            break;
        case 3:
            site = './public/site/page_inpage/cafef.html';
            break;
        case 4:
            site = './public/site/page_inpage/gdn.html';
            break;
        default:
            site = './public/site/page_inpage/dantri.html';
    }

    fs.writeFile(fileName + '/' + title + '.ads', content, function(err) {
        if(err) {
            next(err);
        }
        fs.readFile(site, 'utf-8', function(err, data) {
            if(err) {
                console.error(err)
            }

            //console.log(data);

            var result = data.replace('http://demo.admicro.vn/mobile/background/mb_code.ads', './' + title + '.ads');

            fs.writeFile(fileName + '/' + title + '.html', result, function(err) {
                if(err) {
                    next(err);
                }
                var html_res = '../uploads/images/inpage/' + title + '/' + title + '.html';
                res.render(path.resolve(__dirname, '../src/views/results'), {html: html_res});
            });
        })
    });





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