/**
 * Log a message.
 *
 * @param params {String} Message to log.
 * @param objects {Array} Object chain.
 * @param logger {Object} Logger instance, if additional logging required (other than task exit status).
 * @param callback {Function} Callback on task completion.
 */
exports.log = function(params, objects, logger, callback) {
    logger.log(params);

    callback(null, objects);
};