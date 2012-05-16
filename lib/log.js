/**
 * Log a string.
 *
 * @param string {String} String to log.
 * @param message {Array} Incoming message.
 * @param logger {Object} Logger instance, if additional logging required (other than task exit status).
 * @param callback {Function} Callback on task completion.
 */
exports.log = {
    fn: function(string, message, logger, callback) {
        logger.log(string);
        callback(null, message);
    }
};