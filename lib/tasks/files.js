var fs = require('fs'),
    mime = require('mime'),
    async = require('async');

exports.files = function(params, objects, logger, callback) {
    var filenames = params;

    function readFile(filename, readcb) {
        fs.readFile(filename, function(err, data) {
            if (err) {
                logger.log('Failed to read file: ' + filename);
            }

            readcb(err, {
                meta: {},
                content: data
            });
        });
    }

    async.map(filenames, readFile, function(err, files) {
        callback(err, files);
    });
};