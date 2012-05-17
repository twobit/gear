var async = require('async'),
    core = require('taskjs-core');

/**
 * Advanced flow execution.
 *
 * @param options {String} TODO.
 * @param message {Object} Incoming message.
 * @param logger {Object} Logger instance, if additional logging required (other than task exit status).
 * @param callback {Function} Callback on task completion.
 */
exports.fork = {
    type: 'broadcast',
    fn: function(options, message, logger, callback) {
        var task,
            requires,
            fn,
            tasks = {},
            registry = this._registry || core.createRegistry(),
            self = this;

        function runTask(name, taskOptions, requires) {
            return function(taskcb, result) {
                var new_messages = requires.length ? [] : [message];
                result = result || [];

                requires.forEach(function(task) {
                    new_messages = new_messages.concat(result[task]);
                });

                new_messages.forEach(core.freeze);
                core.dispatch(self, registry.task(name), taskOptions, new_messages, logger, taskcb);
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