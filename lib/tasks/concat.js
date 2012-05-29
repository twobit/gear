/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
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