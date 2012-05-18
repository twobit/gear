/**
 * Concatenates messages.
 *
 * @param options {Object} Concat options.
 * @param options.callback {Function} Callback on each message.
 * @param messages {Array} Incoming messages.
 * @param done {Function} Callback on task completion.
 */
exports.concat = {
    type: 'join',
    fn: function(options, messages, done) {
        options = options || {};
        var callback = options.callback || function(message) {
                return message.body;
            },
            result = messages.reduce(function(prev, cur) {
                return prev + callback(cur);
            }, '');

        done(null, {
            meta: {
                total: messages.length
            },
            body: result
        });
    }
};