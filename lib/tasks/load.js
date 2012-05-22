var fs = require('fs');

/**
 * Loads messages from different sources.
 * TODO: Add more sources i.e. (url).
 *
 * @param options {Object} File options or filename.
 * @param options.file {Object} Filename to load.
 * @param messsage {Object} Incoming message.
 * @param done {Function} Callback on task completion.
 */
exports.load = {
    type: 'broadcast',
    fn: function(options, message, done) {
        options = (typeof options == 'string') ? {file: options} : options;

        if (options.file) {
            fs.readFile(options.file, function(err, data) {
                done(err, {
                    meta: {
                        name: options.file
                    },
                    body: data
                });
            });
        }
    }
};