var TaskJS = require('../lib/task');

var queue = new TaskJS.Queue()
    .files(['index.js', 'package.json', 'foo.txt', 'bar'])
    .concat()
    .inspect()
    .log('\nFinished')
    .run();