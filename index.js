var async = require('async');

function TaskJS() {
    this._tasks = {};
    this._queue = [];
    this._data = [];

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

        this._queue.push(function(done) {
            options.push(done);
            self._tasks[name].apply(self, options);
        });

        return this;
    },

    task: function() {
        var options = Array.prototype.slice.call(arguments),
            name = options.shift();

        return this._task(name, options);
    },

    run: function() {
        async.series(this._queue, function(err, results) {
            if (err) {
                console.log(err);
                return;
            }

            console.log(results);
        });
    },

    flow: function(workflow) {

    }
};

module.exports = TaskJS;