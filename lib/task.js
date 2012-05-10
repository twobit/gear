var async = require('async');

function TaskJS() {
    this._tasks = {};
    this._queue = [
        function(done) {
            done(null, []);
        }
    ];

    this._loadFile('files', './tasks/files');
    this._loadFile('concat', './tasks/concat');
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

        this._queue.push(function(input, done) {
            self._tasks[name].call(self, options, input, done);
        });

        return this;
    },

    task: function() {
        var options = Array.prototype.slice.call(arguments),
            name = options.shift();

        return this._task(name, options);
    },

    run: function() {
        async.waterfall(this._queue, function(err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log(results);
            }
        });
    },

    _flowTask: function(name, options, requires) {
        var self = this;

        return function(done, input) {
            var data = [];

            console.log(name, input, requires);

            input = input || [];

            requires.forEach(function(req) {
                data.concat(input[req]);
            });

            self._tasks[name].call(self, options, input, done);
        };
    },

    flow: function(workflow) {
        var task,
            converted = {},
            requires,
            fn;

        for (task in workflow) {
            requires = workflow[task].requires;
            fn = this._flowTask(workflow[task].task, workflow[task].options, requires || []);

            if (requires) {
                requires.push(fn);
                converted[task] = requires;
            } else {
                converted[task] = fn;
            }
        }

        async.auto(converted);
    }
};

module.exports = TaskJS;