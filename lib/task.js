var events = require('events'),
    util = require('util'),
    fs = require('fs'),
    path = require('path'),
    async = require('async'),
    utils = exports.utils = {
        freeze: function freeze(o) {
            Object.freeze(o);

            for (var prop in o) {
                if (!o.hasOwnProperty(prop) || typeof o !== "object" || Object.isFrozen(o)) continue;
                utils.freeze(o[prop]);
            }

            return o;
        }
    };

/*
 * Registry
 */
function Registry(options) {
    var self = this;
    this._tasks = {};

    this.load({dirname: __dirname + '/tasks'});

    if (options) {
        this.load(options);
    }

    Object.defineProperty(this, 'tasks', {get: function() {
        return Object.keys(self._tasks);
    }});
}

var registry = exports.registry = function registry(options) {
    return new Registry(options);
};

Registry.prototype = {
    load: function(options) {
        options = options || {};

        if (options.dirname) {
            this._loadDir(options.dirname);
        }

        if (options.filename) {
            this._loadFile(options.filename);
        }
    },

    _loadDir: function(dirname) {
        var files = fs.readdirSync(dirname),
            self = this;

        files.forEach(function(filename) {
            self._loadFile(path.join(dirname, filename));
        });
    },

    _loadFile: function(filename) {
        var name,
            file = require(filename);

        for (name in file) {
            this._tasks[name] = file[name];
        }
    },

    task: function(name) {
        return this._tasks[name];
    }
};

/*
 * Queue
 */
function Queue(options) {
    events.EventEmitter.call(this);

    var self = this;
    options = options || {};
    this._registry = options.registry || registry();
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
}

util.inherits(Queue, events.EventEmitter);

var queue = exports.queue = function queue(options) {
    return new Queue(options);
};

Queue.prototype = {
    task: function(name, options) {
        var self = this;
        this._queue.push(function(objects, callback) {
            objects.forEach(utils.freeze);
            self._registry.task(name).fn.call(self, options, objects, self._logger, callback);
        });

        return this;
    },

    run: function(callback) {
        var self = this;
        async.waterfall(this._queue, function(err, results) {
            if (err) {
                self._logger.log('Queue failed');
            }

            if (callback) {
                callback(err, results);
            }
        });
    }
};