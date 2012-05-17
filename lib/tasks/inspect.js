/**
 * Inspects message.
 *
 * @param options {Object} Ignored.
 * @param message {Object} Incoming message.
 * @param logger {Object} Logger instance.
 * @param done {Function} Callback on task completion.
 */
exports.inspect = {
    fn: function(options, message, logger, done) {
        logger.log(message);
        done(null, message);
    }
};