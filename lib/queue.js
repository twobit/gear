/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var async = require('async'),
    Registry = require('./registry').Registry,
    Blob = require('./blob').Blob;

// Zip two arrays together a la Python
function zip(arr1, arr2) {
    var zipped = [];
    for (var i = 0; i < Math.min(arr1.length, arr2.length); i++) {
        zipped.push([arr1[i], arr2[i]]);
    }
    return zipped;
}

function arrayize(arr) {
    return typeof arr === 'undefined' ? [] : Array.prototype.concat(arr);
}

/*
 * Queue - Perform async operations on array of immutable Blobs.
 */
var Queue = exports.Queue = function Queue(options) {
    var self = this;
    options = options || {};
    this._logger = options.logger || console;
    this._registry = options.registry || new Registry();
    this._clear();

    // Add registry tasks
    this._registry.tasks.forEach(function(name) {
        self[name] = self.task.bind(self, name);
    });
};

Queue.prototype._clear = function() {
    this._queue = [
        function(callback) {
            callback(null, []);
        }
    ];
};

Queue.prototype._log = function(message) {
    this._logger.log(message);
};

Queue.prototype._dispatch = function(name, options, blobs, done) {
    var task = this._registry.task(name),
        types = { // Allow task type to be inferred based on task params
            2: 'append',
            3: 'map',
            4: 'reduce'
        },
        type = task.type ? task.type : types[task.length];

    switch (type) {
        case 'append': // Concats new blobs to existing queue
            async.map(arrayize(options), task.bind(this), function(err, results) {
                done(err, blobs.concat(results));
            });
            break;

        case 'collect': // Task can inspect entire queue
            task.call(this, options, blobs, done);
            break;

        case 'slice': // Slice options.length blobs from queue
            async.map(zip(arrayize(options), blobs), (function(arr, cb) {
                task.call(this, arr[0], arr[1], cb);
            }).bind(this), done);
            break;

        case 'each': // Allow task to abort immediately
            async.forEach(blobs, task.bind(this, options), function(err) {
                done(err, blobs);
            });
            break;

        case 'map': // Task transforms one blob at a time
            async.map(blobs, task.bind(this, options), done);
            break;

        case 'reduce': // Merges blobs from left to right
            async.reduce(blobs, new Blob(), task.bind(this, options), function(err, results) {
                done(err, [results]);
            });
            break;

        default:
            throw new Error('Task "' + name + '" has unknown type. Add a type property to the task function.');
    }
};

Queue.prototype.task = function(name, options) {
    this._queue.push(this._dispatch.bind(this, name, options));
    return this;
};

Queue.prototype.run = function(callback) {
    async.waterfall(this._queue, callback);
};