/**
 * Log a string.
 *
 * @param string {String} String to log.
 * @param message {Array} Incoming message.
 * @param done {Function} Callback on task completion.
 */
exports.log = function(string, message, done) {
    this._log(string);
    done(null, message);
};