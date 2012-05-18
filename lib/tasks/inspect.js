/**
 * Inspects message.
 *
 * @param options {Object} Ignored.
 * @param message {Object} Incoming message.
 * @param done {Function} Callback on task completion.
 */
exports.inspect = {
    fn: function(options, message, done) {
        this._log(message);
        done(null, message);
    }
};