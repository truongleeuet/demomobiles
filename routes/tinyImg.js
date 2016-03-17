/**
 * Created by Admin on 3/17/2016.
 */
var promise = require('bluebird');
var Imagemin = require('imagemin');
var imageminPngquant = require('imagemin-pngquant');

module.exports = function help(edgeImageDirectory) {
    return {
        tinyImage: function (edgeImageDirectory) {
            var tinyjpg = new Promise(function (resolve, reject) {
                new Imagemin()
                    .src(edgeImageDirectory + '/*.jpg')
                    .dest(edgeImageDirectory)
                    .use(Imagemin.jpegtran({progressive: true}))
                    .run(function (err, data) {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
            });
            var tinypng = new Promise(function (resolve, reject) {
                new Imagemin()
                    .src(edgeImageDirectory + '/*.png')
                    .dest(edgeImageDirectory)
                    .use(imageminPngquant({quality: '5-10', speed: 3}))
                    .run(function (err, data) {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
            });
            var tinysvg = new Promise(function (resolve, reject) {
                new Imagemin()
                    .src(edgeImageDirectory + '/*.svg')
                    .dest(edgeImageDirectory)
                    .use(Imagemin.svgo({floatPrecision: 2}))
                    .run(function (err, data) {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
            });
            return new Promise(function (resolve, reject) {
                promise.all([tinyjpg, tinypng, tinysvg]).then(function () {
                    resolve();
                }, function (e) {
                    reject(e);
                });
            });
        },
        processImageJob: function (image, fileName) {
            return new Promise(function (resolve, reject) {
                imageEdit = decodeURIComponent(image);
                console.log(imageEdit, '**************');
                var imageFile = path.resolve(__dirname, '../public/upload/' + fileName + '/images/' + '/' + imageEdit);
                fs.readFile(imageFile, 'UTF-8', function (err, data) {
                    //console.log("prcess Image " + imageFile);
                    if (err) {
                        reject(err);
                    } else {
                        var bitmap = fs.readFileSync(imageFile);
                        if (bitmap.length) {
                            var base64data = new Buffer(bitmap).toString('base64');
                            // console.log("image--" + image);
                            imageDictionary[image] = base64data;
                            //deferred.resolve(base64data);
                            resolve(base64data);
                        }
                    }

                });
            });
        },
        editFileJS: function (jsFile, fileName) {
            return new Promise(function (resolve, reject) {
                fs.createReadStream(path.resolve(__dirname, '' + jsFile))
                    .pipe(through.obj(function (file, enc, callbackStream) {
                        var s = this;
                        /* Read out the file */
                        edgeFile = file.toString("utf8");
                        //console.log()
                        /* Replace the image directory with the data url string for base64 xml */
                        edgeFile = edgeFile.replace(/images\//, '');
                        /* Get all  image names */
                        var images = edgeFile.match(/([a-z\-_0-9\/\:\.\%20]*\.(png|jpg|svg|gif|svg))/ig);
                        if (images == null) {
                            reject(err);
                        }
                        /* Create a get job for each  file */
                        var imageJobs = [];

                        for (var i = 0; i < images.length; i++) {

                            imageJobs.push(processImageJob(images[i], fileName));

                        }
                        /* Execute image jobs */
                        promise.all(imageJobs).then(function () {

                            /* Replace images in the file with their base64 equivalent */
                            //var stringImg = 'im+';

                            for (var x in imageDictionary) {
                                //console.log(x + '------------');
                                if (x.indexOf(".png") !== -1) {
                                    //edgeFile = edgeFile.replace(/\,im\+/, ',\'data:image/png;base64,\'+');
                                    edgeFile = edgeFile.replace(x, 'data:image/png;base64,' + imageDictionary[x]);

                                }
                                if (x.indexOf(".gif") !== -1) {
                                    //edgeFile = edgeFile.replace(/\,im\+/, ',\'data:image/gif;base64,\'+');
                                    edgeFile = edgeFile.replace(x, 'data:image/gif;base64,' + imageDictionary[x]);

                                }
                                if (x.indexOf(".jpg") !== -1) {
                                    //edgeFile = edgeFile.replace(/\,im\+/, ',\'data:image/jpg;base64,\'+');
                                    edgeFile = edgeFile.replace(x, 'data:image/jpg;base64,' + imageDictionary[x]);

                                }
                                if (x.indexOf(".svg") !== -1) {
                                    //edgeFile = edgeFile.replace(/\,im\+/, ',\'data:image/svg+xml;base64,\'+');
                                    edgeFile = edgeFile.replace(x, 'data:image/svg+xml;base64,' + imageDictionary[x]);

                                }
                            }
                            s.push(edgeFile);
                            callbackStream();
                        });
                    })).on('data', function (data) {
                    fs.writeFileSync(path.resolve(__dirname, '' + jsFile), data);
                    resolve();
                }).on('error', function (err) {
                    reject(err);
                }).on('end', function () {
                    console.log('The end edit file JS');
                })
            })
        }
    };
};