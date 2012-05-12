var fs = require('fs'),
    path = require('path'),
    async = require('async');

/*
 * Registry
 */
function Registry() {
    this._tasks = {};

    this.loadDir(__dirname + '/tasks');
}

Registry.prototype = {
    loadDir: function(dirname) {
        var files = fs.readdirSync(dirname),
            self = this;

        files.forEach(function(filename) {
            self.loadFile(path.join(dirname, filename));
        });
    },

    loadFile: function(filename) {
        var name,
            file = require(filename);

        for (name in file) {
            this._tasks[name] = file[name];
        }
    }
};

/*
 * Queue
 */
function Queue(registry) {
    this._registry = registry || new Registry();
    this._queue = [
        function(callback) {
            callback(null, []);
        }
    ];
    this._logger = console;

    // Add registry tasks
    for (var name in this._registry._tasks) {
        this[name] = this.task.bind(this, name);
    }
}

Queue.prototype = {
    task: function(name, params) {
        var self = this;
        this._queue.push(function(objects, callback) {
            self._registry._tasks[name].call(self, params, objects, self._logger, callback);
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

/*
 * Flow
 */
function Flow(registry) {
    this._registry = registry || new Registry();
    this._logger = console;
}

Flow.prototype = {
    _task: function(name, params, requires) {
        var self = this;
        return function(callback, result) {
            var objects = [];
            result = result || [];

            requires.forEach(function(task) {
                objects = objects.concat(result[task]);
            });

            self._registry._tasks[name].call(self, params, objects, self._logger, callback);
        };
    },

    flow: function(workflow, callback) {
        var task,
            requires,
            fn,
            tasks = {},
            self = this;

        for (task in workflow) {
            requires = workflow[task].requires;
            fn = this._task(workflow[task].task, workflow[task].params, requires || []);
            tasks[task] = requires ? requires.concat(fn) : fn;
        }

        async.auto(tasks, function(err, results) {
            if (err) {
                self._logger.log('Flow failed');
            }

            if (callback) {
                callback(err, results);
            }
        });
    }
};

exports.Registry = Registry;
exports.Queue = Queue;
exports.Flow = Flow;