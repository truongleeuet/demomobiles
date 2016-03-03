/**
 * Created by Admin on 3/3/2016.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

//router.flag = false;
/* GET users listing. */
router.get('/', function (req, res, next) {
    //res.send('respond with a resource');
    res.render(path.resolve(__dirname, '../src/views/login.ejs'))
});

router.post('/handerLogin', function (req, res, next) {
    //console.log(req.body.userName);
    var auth = {};
    auth.userName = req.body.userName;
    auth.password = req.body.password;
    //res.write();
    var arrayUser = [
        {
            userName: 'truongnguyen',
            password: '1234556'
        },
        {
            userName: 'linhtran',
            password: '1234556'
        },
        {
            userName: 'tungha',
            password: '1234556'
        }
    ];

    for (var i = 0; i < arrayUser.length; i++) {
        if ((arrayUser[i].userName === auth.userName) && (arrayUser[i].password === auth.password)) {
            //router.flag = true;
            req.session.logIn_done = auth;
            break;
        }
    }
    //console.log('***' + )
    if (!req.session.logIn_done) {
        res.redirect('/login');
    }
    if (req.session.logIn_done) {
        res.redirect('/uploads');
    }

    //res.end(auth.userName + auth.password);
})

module.exports = router;
