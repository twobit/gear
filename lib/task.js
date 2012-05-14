var fs = require('fs'),
    path = require('path'),
    async = require('async'),
    utils = {};

utils.deepFreeze = function(o) {
    Object.freeze(o);

    for (var prop in o) {
        if (!o.hasOwnProperty(prop) || typeof o !== "object" || Object.isFrozen(o)) continue;
        deepFreeze(o[prop]);
    }

    return o;
};

/*
 * Registry
 */
function Registry() {
    var self = this;
    this._tasks = {};

    this.load({dirname: __dirname + '/tasks'});

    this.__defineGetter__('tasks', function() {
        return Object.keys(self._tasks);
    });
}

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
}

Queue.prototype = {
    task: function(name, params) {
        var self = this;
        this._queue.push(function(objects, callback) {
            objects.forEach(utils.deepFreeze);
            self._registry.task(name).call(self, params, objects, self._logger, callback);
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

function queue(options) {
    return new Queue(options);
}

function task(name, options) {
    options = options || {};
    var reg = options.registry || new Registry();

    registry.task(name)(options.workflow, [], console, function(err, results) {
        if (options.callback) {
            callback(err, results);
        }
    });
}

exports.Registry = Registry;
exports.queue = queue;
exports.task = task;
exports.flow = task.bind(undefined, 'flow');
exports.utils = utils;