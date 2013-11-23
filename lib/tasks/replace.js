/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
/**
 * Replace with regular expresion.
 *
 * @param options {Object} RegEx options.
 * @param blob {Object} Incoming blob.
 * @param done {Function} Callback on task completion.
 */
exports.replace = function(items, blob, done) {
    var output = blob.result;

    if (!Array.isArray(items)) {
        items = [items];
    }

    items.forEach(function (params) {
        var replace  = params.replace || '',
            flags = params.flags || 'mg',
            regex = params.regex instanceof RegExp ? params.regex : new RegExp(params.regex, flags);

        output = output.replace(regex, replace);
    });

    done(null, new blob.constructor(output, blob));
};