/**
 * Created by Admin on 3/4/2016.
 */

var gulp = require('gulp');
var pm2 = require('pm2');

var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

var jsFiles = ['*.js', 'lib/**/*.js'];

//gulp.task('style', function() {
//    return gulp.src(jsFiles)
//        .pipe(jshint())
//        .pipe(jshint.reporter('jshint-stylish'),
//            {verbose : true})
//        .pipe(jscs())
//        .pipe(jscs.reporter());
//});
//
//gulp.task('inject', function() {
//    var wiredep =  require('wiredep').stream;
//    var inject = require('gulp-inject');
//    var injectSrc = gulp.src(['./public/css/*.css', './public/js/*.js', './public/js/**/*.js'], {read: false});
//    var injectOptions = {
//        ignorePath: '/public'
//    };
//    var options = {
//        bowerJson: require('./bower.json'),
//        directory: './public/lib',
//        ignorePath: '../../public'
//    };
//
//    return gulp.src('./src/views/*.html')
//        .pipe(wiredep(options))
//        .pipe(inject(injectSrc, injectOptions))
//        .pipe(gulp.dest('./src/views'));
//});

gulp.task('serve', function() {
    pm2.connect(true, function () {
        pm2.start({
            name: 'server',
            script: './bin/main.js',
            min_uptime: "200s"
        }, function () {
            console.log('pm2 started');
            pm2.streamLogs('all', 0);
        });
    });
});