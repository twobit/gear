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
     * Appends file contents onto queue.
     *
     * @param options {Object} File options or filename.
     * @param options.name {Object} Filename to read.
     * @param done {Function} Callback on task completion.
     */
    var read = exports.read = function read(options, done) {
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
    read.type = 'append';
    read.browser = true;
})(typeof exports === 'undefined' ? this.tasks || (this.tasks = {}) : exports);