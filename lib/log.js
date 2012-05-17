/**
 * Log a string.
 *
 * @param string {String} String to log.
 * @param message {Array} Incoming message.
 * @param logger {Object} Logger instance.
 * @param done {Function} Callback on task completion.
 */
exports.log = {
    fn: function(string, message, logger, done) {
        logger.log(string);
        done(null, message);
    }
};