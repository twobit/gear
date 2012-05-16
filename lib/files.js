var fs = require('fs'),
    mime = require('mime'),
    async = require('async');

/**
 * Adds objects loaded from files to object chain.
 *
 * @param options {Array} List of files to load.
 * @param objects {Array} Object chain.
 * @param logger {Object} Logger instance, if additional logging required (other than task exit status).
 * @param callback {Function} Callback on task completion.
 */
exports.files = {
    fn: function(options, objects, logger, callback) {
        var filenames = options;

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
    }
};