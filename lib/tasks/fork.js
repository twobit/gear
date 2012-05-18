var async = require('async');

/**
 * Advanced flow execution.
 *
 * @param options {String} TODO.
 * @param message {Object} Incoming message.
 * @param done {Function} Callback on task completion.
 */
exports.fork = {
    type: 'join',
    fn: function(options, messages, done) {
        var task,
            requires,
            notify,
            fn,
            tasks = {},
            self = this;

        function runTask(name, taskOptions, requires, notify) {
            return function(callback, result) {
                var new_messages = requires.length ? [] : messages;
                result = result || [];

                requires.forEach(function(task) {
                    new_messages = new_messages.concat(result[task]);
                });

                self._dispatch(name, taskOptions, new_messages, callback, notify);
            };
        }

        for (task in options) {
            requires = options[task].requires;
            notify = options[task].callback;
            fn = runTask(options[task].task, options[task].options, requires || [], notify);
            tasks[task] = requires ? requires.concat(fn) : fn;
        }

        async.auto(tasks, done);
    }
};