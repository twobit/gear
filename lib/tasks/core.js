/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
/**
 * Gets a message.
 *
 * @param index {Integer} Index of messages.
 * @param messages {Array} Incoming messages.
 * @param done {Function} Callback on task completion.
 */
var get = exports.get = function get(index, messages, done) {
    done(null, messages.slice(index, index + 1));
};
get.type = 'iterate';

/**
 * Log a string.
 *
 * @param string {String} String to log.
 * @param message {Array} Incoming messages.
 * @param done {Function} Callback on task completion.
 */
var log = exports.log = function log(string, messages, done) {
    this._log(string);
    done(null, messages);
};
log.type = 'iterate';

/**
 * Inspects messages.
 *
 * @param options {Object} Ignored.
 * @param message {Object} Incoming messages.
 * @param done {Function} Callback on task completion.
 */
var inspect = exports.inspect = function inspect(options, messages, done) {
    var self = this;
    this._log('INSPECT: ' + messages.length + (messages.length > 1 ? ' messages' : ' message'));

    messages.forEach(function(message, index) {
        self._log(message);
    });

    done(null, messages);
};
inspect.type = 'iterate';