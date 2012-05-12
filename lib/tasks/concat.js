/**
 * Concatenates object chain contents.
 *
 * @param params {Object} Ignored.
 * @param objects {Array} Object chain.
 * @param logger {Object} Logger instance, if additional logging required (other than task exit status).
 * @param callback {Function} Callback on task completion.
 */
exports.concat = function(params, objects, logger, callback) {
    if (!objects.length) {
        callback(null, objects);
        return;
    }

    var result = {
        meta: {},
        content: ''
    };

    objects.forEach(function(object) {
        result.content += object.content;
    });

    callback(null, [result]);
};