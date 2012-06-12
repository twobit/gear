/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    var Blob = typeof require !== 'undefined' ? require('../blob').Blob : gear.Blob;

    /**
     * Add a blob string.
     *
     * @param index {Integer} Index of blobs.
     * @param blobs {Array} Incoming blobs.
     * @param done {Function} Callback on task completion.
     */
    exports.load = function(string, done) {
        done(null, new Blob(string));
    };

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
    get.type = 'collect';

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
    log.type = 'collect';

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
    inspect.type = 'collect';

    /**
     * Do nothing.
     *
     * @param dummy {N/A} N/A.
     * @param blob {Array} Incoming blob.
     * @param done {Function} Callback on task completion.
     */
    exports.noop = function(dummy, blob, done) {
        done(null, blob);
    };
})(typeof exports === 'undefined' ? gear.tasks : exports);