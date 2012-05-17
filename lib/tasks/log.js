/**
 * Log a string.
 *
 * @param string {String} String to log.
 * @param message {Array} Incoming message.
 * @param done {Function} Callback on task completion.
 */
exports.log = {
    fn: function(string, message, done) {
        done(null, message, {body: [string]});
    }
};