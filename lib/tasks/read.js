/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    var Blob = typeof require !== 'undefined' ? require('../blob').Blob : gear.Blob;

    /**
     * Appends file contents onto queue.
     *
     * @param options {Object} File options or filename.
     * @param options.name {String} Filename to read.
     * @param options.encoding {String} File encoding.
     * @param done {Function} Callback on task completion.
     */
    var read = exports.read = function read(options, done) {
        options = (typeof options === 'string') ? {name: options} : options;
        var encoding = options.encoding || 'utf8';
        Blob.readFile(options.name, encoding, done);
    };
    read.type = 'append';
})(typeof exports === 'undefined' ? this.gear.tasks : exports);