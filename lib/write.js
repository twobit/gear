var fs = require('fs');

/**
 * Write the message to disk with an optional checksum in the filename.
 *
 * @param options {Object} Write task options.
 * @param options.file {String} Filename to write.
 * @param message {Object} Incoming message.
 * @param logger {Object} Logger instance, if additional logging required (other than task exit status).
 * @param callback {Function} Callback on task completion.
 */
exports.write = {
    fn: function(options, message, logger, callback) {
        var name = options.file,
            checksum;

        if (name.indexOf('{checksum}') > -1) {  // Replace {checksum} with md5 string
            checksum = Crypto.createHash('md5');
            checksum.update(message.body);
            name = name.replace('{checksum}', checksum.digest('hex'));
        }

        fs.writeFile(name, message.body, function(err) {
            callback(err, message);
        });
    }
};