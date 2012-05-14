/**
 * Log a message.
 *
 * @param options {String} Message to log.
 * @param objects {Array} Object chain.
 * @param logger {Object} Logger instance, if additional logging required (other than task exit status).
 * @param callback {Function} Callback on task completion.
 */
exports.log = function(options, objects, logger, callback) {
    logger.log(options);

    callback(null, objects);
};