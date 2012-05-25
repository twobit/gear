var async = require('async');

/**
 * Advanced flow execution.
 *
 * @param workflow {String} TODO.
 * @param message {Object} Incoming message.
 * @param done {Function} Callback on task completion.
 */
var tasks = exports.tasks = function tasks(workflow, messages, done) {
    var item,
        requires,
        fn,
        auto = {},
        self = this;

    function task(name, options, requires) {
        return function(callback, result) {
            var new_messages = requires.length ? [] : messages;
            result = result || [];

            // Concat dependency messages in order of requires array
            requires.forEach(function(item) {
                new_messages = new_messages.concat(result[item]);
            });

            self._dispatch(name, options, new_messages, callback);
        };
    }

    for (item in workflow) {
        requires = workflow[item].requires;
        fn = task(workflow[item].task, workflow[item].options, requires || []);
        auto[item] = requires ? requires.concat(fn) : fn;
    }

    async.auto(auto, done);
};
tasks.type = 'join';