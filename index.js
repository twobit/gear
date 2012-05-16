var tasks = [
    './lib/concat',
    './lib/files',
    //'./lib/fork',
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