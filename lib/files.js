var fs = require('fs');

/**
 * Broadcasts file messages.
 *
 * @param options {Array} List of files to load.
 * @param messsage {Object} Incoming message.
 * @param logger {Object} Logger instance, if additional logging required (other than task exit status).
 * @param callback {Function} Callback on task completion.
 */
exports.files = {
    type: 'broadcast',
    fn: function(filename, message, logger, callback) {
        fs.readFile(filename, function(err, data) {
            if (err) {
                logger.log('Failed to read file: ' + filename);
            }

            callback(err, {body: data});
        });
    }
};