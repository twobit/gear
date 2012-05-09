var fs = require('fs'),
    mime = require('mime'),
    async = require('async');

module.exports = function(filenames, done) {
    var self = this;

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

    async.map(filenames, readFile, function(err, results) {
        if (err) {
            done(err);
            return;
        }

        self._data = results;
        done(null, 'files');
    });
};