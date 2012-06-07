/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    /**
     * Gets a blob.
     *
     * @param index {Integer} Index of blobs.
     * @param blobs {Array} Incoming blobs.
     * @param done {Function} Callback on task completion.
     */
    var get = exports.get = function get(index, blobs, done) {
        done(null, blobs.slice(index, index + 1));
    };
    get.type = 'iterate';
    get.browser = true;

    /**
     * Log a string.
     *
     * @param string {String} String to log.
     * @param blob {Array} Incoming blobs.
     * @param done {Function} Callback on task completion.
     */
    var log = exports.log = function log(string, blobs, done) {
        this._log(string);
        done(null, blobs);
    };
    log.type = 'iterate';
    log.browser = true;

    /**
     * Inspects blobs.
     *
     * @param options {Object} Ignored.
     * @param blob {Object} Incoming blobs.
     * @param done {Function} Callback on task completion.
     */
    var inspect = exports.inspect = function inspect(options, blobs, done) {
        var self = this;
        this._log('INSPECT: ' + blobs.length + (blobs.length > 1 ? ' blobs' : ' blob'));

        blobs.forEach(function(blob, index) {
            self._log(blob.toString());
        });

        done(null, blobs);
    };
    inspect.type = 'iterate';
    inspect.browser = true;
})(typeof exports === 'undefined' ? this.tasks || (this.tasks = {}) : exports);