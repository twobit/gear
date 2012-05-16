var fs = require('fs');

/**
 * Write the message to disk.
 *
 * @param options {Object} Write task options.
 * @param options.filename {String} Filename to write.
 * @param message {Object} Incoming message.
 * @param logger {Object} Logger instance, if additional logging required (other than task exit status).
 * @param callback {Function} Callback on task completion.
 */
exports.write = {
    fn: function(options, message, logger, callback) {
        var filename = options.filename;

        fs.writeFile(filename, message.body, function(err) {
            callback(err, message);
        });
    }
};