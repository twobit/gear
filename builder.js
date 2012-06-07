var path = require('path'),
    gear = require(path.join(process.cwd(), 'index'));

var files = [
    'lib/registry.js',
    'lib/blob.js',
    'lib/queue.js',
    'lib/tasks/concat.js',
    'lib/tasks/core.js',
    'lib/tasks/load.js',
    'lib/tasks/tasks.js',
    'lib/tasks/write.js'
];

gear.queue()
    .load(files)
    .concat()
    .write('build/gear.js')
    .run(function(err, results) {
        console.log(err);
    });
