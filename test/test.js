var TaskJS = require('../lib/task');

// TaskJS Style
var task = new TaskJS()
    .files(['index.js', 'package.json', 'foo.txt', 'bar'])
    .concat()
    .inspect()
    .log('WTF!!!')
    .run();