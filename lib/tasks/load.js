/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var fs = require('fs');

/**
 * Loads blobs from different sources.
 * TODO: Add more sources i.e. (url).
 *
 * @param options {Object} File options or filename.
 * @param options.file {Object} Filename to load.
 * @param done {Function} Callback on task completion.
 */
var load = exports.load = function load(options, done) {
    options = (typeof options === 'string') ? {file: options} : options;

    if (options.file) {
        fs.readFile(options.file, function(err, data) {
            done(err, {
                meta: {
                    name: options.file
                },
                body: data
            });
        });
    }
};
load.type = 'append';