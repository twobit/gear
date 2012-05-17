/**
 * Concatenates messages.
 *
 * @param options {Object} Concat options.
 * @param options.callback {Function} Callback on each message.
 * @param messages {Array} Incoming messages.
 * @param logger {Object} Logger instance.
 * @param done {Function} Callback on task completion.
 */
exports.concat = {
    type: 'join',
    fn: function(options, messages, logger, done) {
        options = options || {};
        var concatcb = options.callback || function(message) {
                return message.body;
            },
            result;

        result = messages.reduce(function(prev, cur) {
            return prev + concatcb(cur);
        }, '');

        done(null, {body: result});
    }
};