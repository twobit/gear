/**
 * Inspects message.
 *
 * @param options {Object} Ignored.
 * @param message {Object} Incoming message.
 * @param logger {Object} Logger instance, if additional logging required (other than task exit status).
 * @param callback {Function} Callback on task completion.
 */
exports.inspect = {
    fn: function(options, message, logger, callback) {
        logger.log(message);
        callback(null, message);
    }
};