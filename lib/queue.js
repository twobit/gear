var async = require('async'),
    Registry = require('./registry').Registry;

function freeze(o) {
    Object.freeze(o);

    for (var prop in o) {
        if (!o.hasOwnProperty(prop) || typeof o !== "object" || Object.isFrozen(o)) continue;
        freeze(o[prop]);
    }

    return o;
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

Queue.prototype._dispatch = function(name, options, messages, done, notify) {
    var task = this._registry.task(name),
        self = this;

    messages.forEach(freeze);

    switch (task.type) {
        case 'broadcast':
            async.map(
                options.length ? options : [],
                function(option, callback) {
                    // FIXME: incoming message empty
                    task.fn.call(self, option, {}, callback);
                },
                function(err, results) {
                    if (notify) {
                        notify(err, results);
                    }
                    done(err, results);
                }
            );
            break;

        case 'join':
            task.fn.call(self, options, messages, function(err, results) {
                if (notify) {
                    notify(err, [results]);
                }
                done(err, [results]);
            });
            break;

        default:
            async.map(messages, function(message, callback) {
                    task.fn.call(self, options, message, callback);
                },
                function(err, results) {
                    if (notify) {
                        notify(err, results);
                    }
                    done(err, results);
                }
            );
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