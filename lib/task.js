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

    // Populate prototype with registry tasks
    for (var name in this._registry._tasks) {
        Queue.prototype[name] = this.task.bind(this, name);
    }
}

Queue.prototype = {
    _task: function(name, options) {
        var self = this;

        this._queue.push(function(input, callback) {
            self._registry._tasks[name].call(self, options, input, callback);
        });

        return this;
    },

    task: function() {
        var options = Array.prototype.slice.call(arguments),
            name = options.shift();

        return this._task(name, options);
    },

    run: function(callback) {
        async.waterfall(this._queue, callback);
    }
};

/*
 * Flow
 */
function Flow(registry) {
    this._registry = registry || new Registry();
}

Flow.prototype = {
    _task: function(name, options, requires) {
        var self = this;
        return function(callback, input) {
            var data = [];
            input = input || [];

            requires.forEach(function(req) {
                data = data.concat(input[req]);
            });

            self._registry._tasks[name].call(self, options, data, callback);
        };
    },

    flow: function(workflow, callback) {
        var task,
            requires,
            fn,
            tasks = {};

        for (task in workflow) {
            requires = workflow[task].requires;
            fn = this._task(workflow[task].task, workflow[task].options, requires || []);
            tasks[task] = requires ? requires.concat(fn) : fn;
        }

        async.auto(tasks, callback);
    }
};

exports.Registry = Registry;
exports.Queue = Queue;
exports.Flow = Flow;