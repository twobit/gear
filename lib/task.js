var async = require('async');

function Registry() {
    this._tasks = {};
}

Registry.prototype.loadFile = function(filename) {
    var name,
        file = require(filename);

    for (name in file) {
        this._tasks[name] = file[name];
    }
};

function TaskJS(registry) {
    this._registry = registry || new Registry();
    this._queue = [
        function(callback) {
            callback(null, []);
        }
    ];

    for (var name in this._registry._tasks) {
        TaskJS.prototype[name] = this.task.bind(this, name);
    }
}

TaskJS.prototype = {
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
    },

    _flowTask: function(name, options, requires) {
        var self = this;

        return function(callback, input) {
            var data = [];
            input = input || [];

            requires.forEach(function(req) {
                data = data.concat(input[req]);
            });

            self._tasks[name].call(self, options, data, callback);
        };
    },

    flow: function(workflow, callback) {
        var task,
            requires,
            fn,
            tasks = {};

        for (task in workflow) {
            requires = workflow[task].requires;
            fn = this._flowTask(workflow[task].task, workflow[task].options, requires || []);
            tasks[task] = requires ? requires.concat(fn) : fn;
        }

        async.auto(tasks, callback);
    }
};

exports.Registry = Registry;
exports.TaskJS = TaskJS;