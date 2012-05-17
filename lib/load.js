var fs = require('fs');

/**
 * Loads messages from different sources.
 * TODO: Add more sources i.e. (url).
 *
 * @param options {Object} File options.
 * @param options.file {Object} Filename to load.
 * @param messsage {Object} Incoming message.
 * @param logger {Object} Logger instance.
 * @param done {Function} Callback on task completion.
 */
exports.load = {
    type: 'broadcast',
    fn: function(options, message, logger, done) {
        if (options.file) {
            fs.readFile(options.file, function(err, data) {
                if (err) {
                    logger.log('Failed to load file: ' + options.file);
                }

                done(err, {body: data});
            });
        }
    }
};