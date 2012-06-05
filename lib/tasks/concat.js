/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
/**
 * Concatenates blobs.
 *
 * @param options {Object} Concat options.
 * @param options.callback {Function} Callback on each blob.
 * @param blobs {Array} Incoming blobs.
 * @param done {Function} Callback on task completion.
 */
var concat = exports.concat = function concat(options, prev, blob, done) {
    options = options || {};
    var callback = options.callback || function(blob) {
            return blob.body;
        };

    done(null, {
        body: prev.body + callback(blob)
    });
};
concat.type = 'reduce';