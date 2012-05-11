var TaskJS = require('../lib/task');

var queue = new TaskJS.Queue()
    .files(['index.js', 'package.json', 'foo.txt', 'bar'])
    .concat()
    .inspect()
    .log('\nFinished')
    .write({filename: 'test1.txt'})
    .run();

/*
var queue2 = new TaskJS.Queue()
    .task('files', ['index.js'])
    .task('concat')
    .task('inspect')
    .task('log', '\nFinished 2')
    .run();
*/