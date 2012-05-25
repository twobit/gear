var async = require('async'),
    Registry = require('./registry').Registry,
    util = require('util'),
    isArray = util.isArray || function(ar) {
        return Array.isArray(ar) ||
            (typeof ar === 'object' && Object.prototype.toString.call(ar) === '[object Array]');
    };

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

Queue.prototype._dispatch = function(name, options, messages, done, notify) {
    var task = this._registry.task(name);

    function transform(callback, err, results) {
        callback = callback || function(r) {return r;};
        var transformed = callback(results);
        if (notify) {
            notify(err, transformed);
        }
        done(err, transformed);
    }

    // Deep freeze messages
    messages.forEach(function(o) {
        Object.freeze(o);
        for (var prop in o) {
            if (!o.hasOwnProperty(prop) || typeof o !== "object" || Object.isFrozen(o)) continue;
            freeze(o[prop]);
        }
        return o;
    });

    switch (task.type) {
        case 'append':
            if (options === undefined) {
                options = [];
            } else {
                if (!isArray(options)) {
                    options = [options];
                }
            }

            async.map(options, task.bind(this), transform.bind(this, function(results) {
                return messages.concat(results);
            }));
            break;

        case 'reduce':
            async.reduce(messages, {meta: {}, body: ''}, task.bind(this, options), transform.bind(this, function(result) {
                return [result];
            }));
            break;

        case 'slice':
            async.map(messages.slice(0, isArray(options) ? options.length : 1), task.bind(this, options), transform.bind(this, null));
            break;

        default: // map type
            async.map(messages, task.bind(this, options), transform.bind(this, null));
            break;
    }
};

Queue.prototype.task = function(name, options, notify) {
    var self = this;
    this._queue.push(function(messages, done) {
        self._dispatch(name, options, messages, done, notify);
    });
    return this;
};

Queue.prototype.run = function(callback) {
    async.waterfall(this._queue, callback);
};