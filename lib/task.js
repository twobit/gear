var async = require('async');

function TaskJS() {
    this._tasks = {};
    this._queue = [
        function(callback) {
            callback(null, []);
        }
    ];

    this._loadFile('files', './tasks/files');
    this._loadFile('concat', './tasks/concat');
    this._loadFile('log', './tasks/log');
    this._loadFile('inspect', './tasks/inspect');
}

TaskJS.prototype = {
    _loadFile: function(name, path) {
        var self = this;
        this._tasks[name] = require(path);

        TaskJS.prototype[name] = function() {
            return self._task(name, Array.prototype.slice.call(arguments));
        };
    },

    _task: function(name, options) {
        var self = this;

        this._queue.push(function(input, callback) {
            self._tasks[name].call(self, options, input, callback);
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

module.exports = TaskJS;