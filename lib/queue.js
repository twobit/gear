/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    var async = typeof require !== 'undefined' ? require('async') : this.gear.vendor.async,
        Registry = typeof require !== 'undefined' ? require('./registry').Registry : this.gear.Registry,
        Blob = typeof require !== 'undefined' ? require('./blob').Blob : this.gear.Blob;

    /*
     * Queue
     */
    var Queue = exports.Queue = function Queue(options) {
        var self = this;
        options = options || {};
        this._logger = options.logger || console;
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
        this._logger.log(message);
    };

    Queue.prototype._dispatch = function(name, options, blobs, done) {
        var task = this._registry.task(name);

        // Task parameters determine how blobs are processed
        switch (task.length) {
            case 2: // Add blobs to queue
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

            case 3:
                if (task.type === 'collect') { // Task can look at all blobs at once
                    task.call(this, options, blobs, done);
                } else if (task.type === 'slice') { // Select up to options.length blobs
                    async.map(blobs.slice(0, Array.isArray(options) ? options.length : 1), task.bind(this, options), done);
                } else { // Transform blob on a per task basis
                    async.map(blobs, task.bind(this, options), done);
                }
                break;

            case 4: // Reduce blobs operating on a per task basis
                async.reduce(blobs, new Blob(), task.bind(this, options), function(err, results) {
                    done(err, [results]);
                });
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
})(typeof exports === 'undefined' ? this.gear : exports);