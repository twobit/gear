var async = require('async'),
    Registry = require('./registry').Registry;

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

Queue.prototype._dispatch = function(name, options, messages, done) {
    var task = this._registry.task(name);

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
                if (!Array.isArray(options)) {
                    options = [options];
                }
            }

            async.map(options, task.bind(this), function(err, results) {
                done(err, messages.concat(results));
            });
            break;

        case 'iterate':
            task.call(this, options, messages, done);
            break;

        case 'reduce':
            async.reduce(messages, {meta: {}, body: ''}, task.bind(this, options), function(err, results) {
                done(err, [results]);
            });
            break;

        case 'slice':
            async.map(messages.slice(0, Array.isArray(options) ? options.length : 1), task.bind(this, options), done);
            break;

        default: // map type
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