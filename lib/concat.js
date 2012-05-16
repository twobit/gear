/**
 * Concatenates object chain contents.
 *
 * @param options {Object} Ignored.
 * @param objects {Array} Object chain.
 * @param objects.callback {Function} Callback on each objects content
 * @param logger {Object} Logger instance, if additional logging required (other than task exit status).
 * @param callback {Function} Callback on task completion.
 */
exports.concat = {
    fn: function(options, objects, logger, callback) {
        options = options || {};
        var concatcb = options.callback || function(s) {
                return s.content;
            },
            result = {
                meta: {},
                content: ''
            };

        if (!objects.length) {
            callback(null, objects);
            return;
        }

        objects.forEach(function(object) {
            result.content += concatcb(object);
        });

        callback(null, [result]);
    }
};