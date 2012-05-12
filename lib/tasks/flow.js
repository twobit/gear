var async = require('async'),
    Registry = require('../task').Registry;

/**
 * Advanced flow execution,
 *
 * @param params {String} TODO.
 * @param objects {Array} Object chain.
 * @param logger {Object} Logger instance, if additional logging required (other than task exit status).
 * @param callback {Function} Callback on task completion.
 */
exports.flow = function(params, objects, logger, callback) {
    var task,
        requires,
        fn,
        tasks = {},
        registry = this._registry || new Registry(),
        self = this;

    function runTask(name, options, requires) {
        return function(taskcb, result) {
            var new_objects = requires.length ? [] : objects;
            result = result || [];

            requires.forEach(function(task) {
                new_objects = new_objects.concat(result[task]);
            });

            registry._tasks[name].call(self, options, new_objects, logger, taskcb);
        };
    }

    for (task in params) {
        requires = params[task].requires;
        fn = runTask(params[task].task, params[task].params, requires || []);
        tasks[task] = requires ? requires.concat(fn) : fn;
    }

    async.auto(tasks, function(err, results) {
        if (err) {
            logger.log('Flow failed');
        }

        callback(err, results);
    });
};