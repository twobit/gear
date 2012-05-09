var async = require('async');

function Task() {
    this._tasks = {};
    this._queue = [];
    this._data = [];

    this._loadFile('files', './tasks/files');
    this._loadFile('inspect', './tasks/inspect');
}

Task.prototype = {
    _loadFile: function(name, path) {
        var self = this;
        this._tasks[name] = require(path);

        Task.prototype[name] = function() {
            return self.task(name, Array.prototype.slice.call(arguments));
        };
    },

    task: function(name, options) {
        var self = this;

        this._queue.push(function(done) {
            options.push(done);
            self._tasks[name].apply(self, options);
        });

        return this;
    },

    run: function() {
        async.series(this._queue, function(err, results) {
            //console.log(err, results);
        });
    }
};

function main() {
    var task = new Task()
        .files(['index.js', 'package.json', 'foo.txt', 'bar'])
        .inspect();

    task.run();
}

main();