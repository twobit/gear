/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    if (require) {
        var async = require('async'),
            Registry = require('./registry').Registry,
            Blob = require('./blob').Blob;
    }
    
    /*
     * Queue
     */
    var Queue = exports.Queue = function Queue(options) {
        var self = this;
        options = options || {};
        this._registry = options.registry || new Registry();
        this._queue = [
            function(callback) {
                callback(null, []);
            }
        ];

        // Add registry tasks
        this._registry.tasks.forEach(function(name) {
            self[name] = self.task.bind(self, name);
        });
    };

    Queue.prototype._log = function(message) {
        console.log(message);
    };

    Queue.prototype._dispatch = function(name, options, blobs, done) {
        var task = this._registry.task(name);

        // Task type determines how blobs are processed
        switch (task.type) {
            case 'append': // Add blobs to queue
                if (options === undefined) {
                    options = [];
                } else {
                    if (!Array.isArray(options)) {
                        options = [options];
                    }
                }

                async.map(options, task.bind(this), function(err, results) {
                    done(err, blobs.concat(results));
                });
                break;

            case 'iterate': // Task can look at all blobs at once
                task.call(this, options, blobs, done);
                break;

            case 'reduce': // Reduce blobs operating on a per task basis
                async.reduce(blobs, new Blob(), task.bind(this, options), function(err, results) {
                    done(err, [results]);
                });
                break;

            case 'slice': // Select up to options.length blobs
                async.map(blobs.slice(0, Array.isArray(options) ? options.length : 1), task.bind(this, options), done);
                break;

            default: // Transform blob on a per task basis
                async.map(blobs, task.bind(this, options), done);
                break;
        }
    };

    Queue.prototype.task = function(name, options) {
        this._queue.push(this._dispatch.bind(this, name, options));
        return this;
    };

    Queue.prototype.run = function(callback) {
        async.waterfall(this._queue, callback);
    };
})(typeof exports === 'undefined' ? this['gear_core'] = {} : exports);