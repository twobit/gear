var async = require('async'),
    core = require('taskjs-core');

/**
 * Advanced flow execution.
 *
 * @param options {String} TODO.
 * @param message {Object} Incoming message.
 * @param logger {Object} Logger instance.
 * @param done {Function} Callback on task completion.
 */
exports.fork = {
    type: 'join',
    fn: function(options, messages, logger, done) {
        var task,
            requires,
            fn,
            tasks = {},
            self = this;

        function runTask(name, taskOptions, requires) {
            return function(callback, result) {
                var new_messages = requires.length ? [] : messages;
                result = result || [];

                requires.forEach(function(task) {
                    new_messages = new_messages.concat(result[task]);
                });

                new_messages.forEach(core.freeze);
                core.dispatch(self, self._registry.task(name), taskOptions, new_messages, logger, callback);
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

            done(err, results);
        });
    }
};