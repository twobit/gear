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
    this._tasks = {};

    this.loadDir(__dirname + '/tasks');

    this.__defineGetter__('tasks', function() {
        return this._tasks;
    });
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
    var name;

    this._registry = registry || new Registry();
    this._queue = [
        function(callback) {
            callback(null, []);
        }
    ];
    this._logger = console;

    // Add registry tasks
    for (name in this._registry.tasks) {
        this[name] = this.task.bind(this, name);
    }
}

Queue.prototype = {
    task: function(name, params) {
        var self = this;
        this._queue.push(function(objects, callback) {
            objects.forEach(utils.deepFreeze);
            self._registry.tasks[name].call(self, params, objects, self._logger, callback);
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

function flow(workflow, callback, registry) {
    var reg = registry || new Registry();

    registry.tasks.flow.call(self, workflow, [], console, function(err, results) {
        if (callback) {
            callback(err, results);
        }
    });
}

exports.Registry = Registry;
exports.Queue = Queue;
exports.flow = flow;
exports.utils = utils;