/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    if (typeof require !== 'undefined') {
        var async = require('async');
    }

    /**
     * Advanced flow execution.
     *
     * @param workflow {String} TODO.
     * @param blob {Object} Incoming blob.
     * @param done {Function} Callback on task completion.
     */
    var tasks = exports.tasks = function tasks(workflow, blobs, done) {
        var item,
            requires,
            fn,
            auto = {},
            self = this;

        function task(name, options, requires) {
            return function(callback, result) {
                var new_blobs = requires.length ? [] : blobs;
                result = result || [];

                // Concat dependency blobs in order of requires array
                requires.forEach(function(item) {
                    new_blobs = new_blobs.concat(result[item]);
                });

                self._dispatch(name, options, new_blobs, callback);
            };
        }

        for (item in workflow) {
            requires = workflow[item].requires;
            fn = task(workflow[item].task, workflow[item].options, requires || []);
            auto[item] = requires ? requires.concat(fn) : fn;
        }
        
        async.auto(auto, done);
    };
    tasks.type = 'iterate';
})(typeof exports === 'undefined' ? this.tasks || (this.tasks = {}) : exports);