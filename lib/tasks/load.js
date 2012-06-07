/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    if (require) {
        var fs = require('fs'),
            Blob = require('../blob').Blob;
    }

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
                done(err, new Blob(data, {name: options.file}));
            });
        }
    };
    load.type = 'append';
})(typeof exports === 'undefined' ? this['gear_tasks'] = {} : exports);