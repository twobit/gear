/**
 * Concatenates messages.
 *
 * @param options {Object} Concat options.
 * @param options.callback {Function} Callback on each message.
 * @param messages {Array} Incoming messages.
 * @param done {Function} Callback on task completion.
 */
var concat = exports.concat = function concat(options, prev, message, done) {
    options = options || {};
    var callback = options.callback || function(message) {
            return message.body;
        };

    done(null, {
        body: prev.body + callback(message)
    });
};
concat.type = 'reduce';