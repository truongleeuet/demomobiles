/**
 * Created by Admin on 3/14/2016.
 */
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
var Admzip = require('adm-zip');
var bluebird = require('bluebird');
var help = require('./tinyImg');

//routerInpage.get('/', function(req, res, next) {
//    res.render(path.resolve(__dirname, '../src/views/inpage/inpage.ejs'))
//});
var fileName = '';
var type = '';
var edgeImageDirectory;
routerInpage.get('/', function (req, res, next) {
    res.render(path.resolve(__dirname, '../src/views/top/top'));
});
var title = '';

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        title = req.body.title.replace(/\s/g, '_');
        type = file.originalname.substr(file.originalname.lastIndexOf('.') + 1);
        fileName = type === 'zip' ? './public/uploads/banner/top/' + title : './public/uploads/images/top/' + title;
        // fileName = './public/uploads/images/top/' + title;
        //console.log(file);
        fs.mkdir(fileName, function (err) {
            if (err) {
                console.error(err);
            }
            cb(null, fileName);
        });
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({storage: storage});

routerInpage.post('/upload_top', upload.any(), function (req, res, next) {
    var file = req.files;
    if (type === 'zip') {
        console.log(file[0]);
        var zip = new Admzip(file[0].path);
        var dateup = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '');

        file[0].originalname = file[0].originalname.slice(0, file[0].originalname.lastIndexOf('.'));
        console.log(file[0].originalname);
        var zipEntries = zip.getEntries();
        zip.extractAllTo(path.resolve(fileName + '/' + file[0].originalname + '/'));
        var js = '';
        zipEntries.forEach(function(zipEntry) {
            if(zipEntry.name.indexOf('_edge.js') !== -1) {
                js = zipEntry.name;
            }
            console.log(zipEntry.name);
        })
        edgeImageDirectory = path.resolve(fileName + '/' + file[0].originalname + '/images');
        help(edgeImageDirectory).tinyImage().then(function () {
            res.end('Done Unzip');
        });
    } else {
        var content = 'var mbzone2830 = new zoneM(2830, {' +
            '"html": "",' +
            '"css": "",' +
            '"mobilead":1,' +
            '"df": []' +
            '});' +
            'mbzone2830.addBanners({' +
            '"cpc": [{' +
            '"id": "228524",' +
            '"cid": "1039469",' +
            '"src": "' + file[0].originalname + '",' +
            '"htmlcode":"",' +
            '"title": "Game ",' +
            '"content": "skill ảo tung chảo",' +
            '"link": "' + req.body.desUrl + '",' +
            '"type": "9",' +
            '"os": "",' +
            '"os_v": "",' +
            '"dv_t": "",' +
            '"color":"#f91600|#fff",' +
            '"dv_m": "",' +
            '"br": "",' +
            '"br_v": "",' +
            '"l": "",' +
            '"la": "",' +
            '"statustext": "T\u1ea3i FREE",' +
            '"cpa": "0",' +
            '"buttonnote": "gi?i thi?u",' +
            '"moblocation": "0",' +
            '"provider": "",' +
            '"link3rd": "",' +
            '"clk_call": "",' +
            '"ispopup": "0",' +
            '"logo_image": "http:\/\/admicro2+vcmedia+vn\/adt\/cpc\/mb\/2013\/08\/logo--m21378810915+jpg",' +
            '"brand_name": "SohaGame",' +
            '"blogo": "http:\/\/admicro2+vcmedia+vn\/adt\/cpc\/mb\/2013\/08\/logo--m21378810915+jpg",' +
            '"bname": "SohaGame",' +
            '"download": 0,' +
            '"star": "5",' +
            '"terms": null' +
            '}],' +
            '"cpm": []' +
            '});';

        var site = req.body.slcBanner;

        switch (site) {
            case 0:
                site = './public/site/page_topbanner/dantri.html';
                break;
            case 1:
                site = './public/site/page_topbanner/kenh14.html';
                break;
            case 2:
                site = './public/site/page_topbanner/afamily.html';
                break;
            case 3:
                site = './public/site/page_topbanner/cafef.html';
                break;
            case 4:
                site = './public/site/page_topbanner/gdn.html';
                break;
            default:
                site = './public/site/page_topbanner/dantri.html';
        }
        fs.writeFile(fileName + '/' + title + '.ads', content, function (err) {
            if (err) {
                next(err);
            }
            fs.readFile(site, 'utf-8', function (err, data) {
                if (err) {
                    console.error(err);
                }

                //console.log(data);

                var result = data.replace('http://demo.admicro.vn/mobile/topbanner/mb_code.ads', './' + title + '.ads');
                var html = fileName + '/' + title + '.html';
                console.log(html, '****************');

                fs.writeFile(html, result, function (err) {
                    if (err) {
                        next(err);
                    }
                    var htmlRes = '../uploads/images/top/' + title + '/' + title + '.html';
                    res.render(path.resolve(__dirname, '../src/views/results'), {html: htmlRes});
                });
            });
        });
    }
});

routerInpage.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.render('error', {
        message: err.message,
        error: err
    });
});
module.exports = routerInpage;