var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
var shortid = require('shortid');
var config = require('../config/config');

aws.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region,
    signatureVersion: 'v4'
});
var s3 = new aws.S3({endpoint: config.aws.endpoint});

var generateFileName = function (req, file) {
    return shortid.generate() + file.originalname.substr(file.originalname.lastIndexOf('.'));
}

module.exports.uploadImage = multer({
    fileFilter: function (req, file, cb) {
        // index is -1 if file extension is not given.
        if (file.originalname.lastIndexOf('.') < 0) {
            cb(new Error('Image file extension is not given.'));
        }
        else if (file.mimetype != "image/png" && file.mimetype != "image/jpeg") {
            cb(new Error('Image type is not supported. Upload jpeg or png format images.'));
        }
        else {
            cb(null, true);
        }
    },
    storage: multerS3({
        s3: s3,
        bucket: config.aws.bucketName,
        acl: 'public-read',
        key: function (req, file, cb) {
            var blobPath = generateFileName(req, file);
            cb(null, blobPath);
        }
    })
})