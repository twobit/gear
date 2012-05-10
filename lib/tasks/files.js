var fs = require('fs'),
    mime = require('mime'),
    async = require('async');

exports.files = function(options, data, callback) {
    var filenames = options[0];

    function readFile(filename, readcb) {
        fs.readFile(filename, function(err, data) {
            readcb(null, {
                status: err ? 404 : 200,
                uri: filename,
                headers: {
                    'Content-Type': mime.lookup(filename)
                },
                content: data
            });
        });
    }

    async.map(filenames, readFile, function(err, files) {
        callback(err, files);
    });
};