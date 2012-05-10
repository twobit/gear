var fs = require('fs'),
    mime = require('mime'),
    async = require('async');

module.exports = function(options, data, done) {
    var filenames = options[0];

    function readFile(filename, cb) {
        fs.readFile(filename, function(err, data) {
            cb(null, {
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
        done(err, files);
    });
};