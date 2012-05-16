var async = require('async'),
    core = require('taskjs-core');

/**
 * Advanced flow execution.
 *
 * @param options {String} TODO.
 * @param objects {Array} Object chain.
 * @param logger {Object} Logger instance, if additional logging required (other than task exit status).
 * @param callback {Function} Callback on task completion.
 */
exports.fork = {
    fn: function(options, objects, logger, callback) {
        var task,
            requires,
            fn,
            tasks = {},
            registry = this._registry || core.registry(),
            self = this;

        function runTask(name, taskOptions, requires) {
            return function(taskcb, result) {
                var new_objects = requires.length ? [] : objects;
                result = result || [];

                requires.forEach(function(task) {
                    new_objects = new_objects.concat(result[task]);
                });

                new_objects.forEach(core.utils.freeze);
                registry.task(name).fn.call(self, taskOptions, new_objects, logger, taskcb);
            };
        }

        for (task in options) {
            requires = options[task].requires;
            fn = runTask(options[task].task, options[task].options, requires || []);
            tasks[task] = requires ? requires.concat(fn) : fn;
        }

        async.auto(tasks, function(err, results) {
            if (err) {
                logger.log('Fork failed');
            }

            console.log(results);

            callback(err, results);
        });
    }
};