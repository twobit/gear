/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    var async;
    if (typeof require !== 'undefined') {
        async = require('async');
    }
    else {
        async = this.async;
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
            name,
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
            name = workflow[item].task ? workflow[item].task : 'noop';
            requires = workflow[item].requires;

            if (requires === undefined) {
                requires = [];
            } else {
                if (!Array.isArray(requires)) {
                    requires = [requires];
                }
            }

            fn = task(name, workflow[item].options, requires);
            auto[item] = requires ? requires.concat(fn) : fn;
        }
        
        async.auto(auto, function(err, results) {
            if (err) {
                done(err);
                return;
            }
            
            done(err, results.join ? results.join : []);
        });
    };
    tasks.type = 'iterate';
    tasks.browser = true;
})(typeof exports === 'undefined' ? this.tasks || (this.tasks = {}) : exports);