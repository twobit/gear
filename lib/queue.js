var events = require('events'),
    util = require('util'),
    async = require('async'),
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
    events.EventEmitter.call(this);

    var self = this;
    options = options || {};
    this._registry = options.registry || new Registry();
    this._queue = [
        function(callback) {
            callback(null, []);
        }
    ];
    this._logger = console;

    // Add registry tasks
    this._registry.tasks.forEach(function(name) {
        self[name] = self.task.bind(self, name);
    });
};

util.inherits(Queue, events.EventEmitter);

Queue.prototype._dispatch = function(name, options, messages, done) {
    var task = this._registry.task(name),
        self = this;

    messages.forEach(freeze);

    switch (task.type) {
        case 'broadcast':
            async.map(
                options.length ? options : [],
                function(option, callback) {
                    // FIXME: incoming message empty
                    task.fn.call(self, option, {}, self._logger, callback);
                },
                done
            );
            break;

        case 'join':
            task.fn.call(self, options, messages, self._logger, function(err, results) {
                done(err, [results]);
            });
            break;

        default:
            async.map(messages, function(message, callback) {
                    task.fn.call(self, options, message, self._logger, callback);
                },
                done
            );
            break;
    }
};

Queue.prototype.task = function(name, options) {
    var self = this;
    this._queue.push(function(messages, done) {
        self._dispatch(name, options, messages, done);
    });

    return this;
};

Queue.prototype.run = function(callback) {
    var self = this;
    async.waterfall(this._queue, function(err, results) {
        if (err) {
            self._logger.log('Queue failed');
        }

        if (callback) {
            callback(err, results);
        }
    });
};