var core = require('taskjs-core');

var registry = exports.registry = function(options) {
    var reg = new core.Registry(options);
    reg.load({dirname: __dirname + '/lib'});
    return reg;
};

exports.queue = function(options) {
    options = options || {};
    options.registry = options.registry || registry();
    return new core.Queue(options);
};

var tasks = [
    './lib/concat',
    './lib/load',
    './lib/fork',
    './lib/inspect',
    './lib/log',
    './lib/write'
];

tasks.forEach(function(task) {
    var mod = require(task),
        name;

    for (name in mod) {
        exports[name] = mod[name];
    }
});