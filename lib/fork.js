var async = require('async'),
    core = require('taskjs-core');

/**
 * Advanced flow execution.
 *
 * @param options {String} TODO.
 * @param messages {Array} Incoming messages.
 * @param logger {Object} Logger instance, if additional logging required (other than task exit status).
 * @param callback {Function} Callback on task completion.
 */
exports.fork = {
    fn: function(options, messages, logger, callback) {
        var task,
            requires,
            fn,
            tasks = {},
            registry = this._registry || core.createRegistry(),
            self = this;

        function runTask(name, taskOptions, requires) {
            return function(taskcb, result) {
                var new_messages = requires.length ? [] : messages;
                result = result || [];

                requires.forEach(function(task) {
                    new_messages = new_messages.concat(result[task]);
                });

                new_messages.forEach(core.utils.freeze);
                registry.task(name).fn.call(self, taskOptions, new_messages, logger, taskcb);
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