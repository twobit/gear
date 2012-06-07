/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    var Blob;
    if (typeof require !== 'undefined') {
        var fs = require('fs');
        Blob = require('../blob').Blob;
    }
    else {
        Blob = gear.Blob;
    }

    /**
     * Loads blobs from different sources.
     * TODO: Add more sources i.e. (url).
     *
     * @param options {Object} File options or filename.
     * @param options.name {Object} Filename to load.
     * @param done {Function} Callback on task completion.
     */
    var load = exports.load = function load(options, done) {
        options = (typeof options === 'string') ? {name: options} : options;

        if (typeof fs === 'undefined') {
            if (options.name in localStorage) {
                done(null, new Blob(localStorage[options.name], {name: options.name}));
            }
            else {
                done('localStorage has no item ' + options.name);
            }
        }
        else {
            fs.readFile(options.name, function(err, data) {
                done(err, new Blob(data, {name: options.name}));
            });
        }
    };
    load.type = 'append';
    load.browser = true;
})(typeof exports === 'undefined' ? this.tasks || (this.tasks = {}) : exports);