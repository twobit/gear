/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var async = require('async'),
    Gearbox = require('./gearbox').Gearbox;

/*
 * Queue
 */
var Queue = exports.Queue = function Queue(options) {
    var self = this;
    options = options || {};
    this._gearbox = options.gearbox || new Gearbox();
    this._queue = [
        function(callback) {
            callback(null, []);
        }
    ];

    // Add gearbox tasks
    this._gearbox.tasks.forEach(function(name) {
        self[name] = self.task.bind(self, name);
    });
};

Queue.prototype._log = function(message) {
    console.log(message);
};

Queue.prototype._dispatch = function(name, options, messages, done) {
    var task = this._gearbox.task(name);

    // Deep freeze messages
    messages.forEach(function(o) {
        Object.freeze(o);
        for (var prop in o) {
            if (!o.hasOwnProperty(prop) || typeof o !== "object" || Object.isFrozen(o)) continue;
            freeze(o[prop]);
        }
        return o;
    });

    // task type determines how messages are processed
    switch (task.type) {
        case 'append': // add messages to queue
            if (options === undefined) {
                options = [];
            } else {
                if (!Array.isArray(options)) {
                    options = [options];
                }
            }

            async.map(options, task.bind(this), function(err, results) {
                done(err, messages.concat(results));
            });
            break;

        case 'iterate': // task can look at all messages at once
            task.call(this, options, messages, done);
            break;

        case 'reduce': // reduce messages operating on a per task basis
            async.reduce(messages, {meta: {}, body: ''}, task.bind(this, options), function(err, results) {
                done(err, [results]);
            });
            break;

        case 'slice': // select up to options.length messages
            async.map(messages.slice(0, Array.isArray(options) ? options.length : 1), task.bind(this, options), done);
            break;

        default: // transform message on a per task basis
            async.map(messages, task.bind(this, options), done);
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