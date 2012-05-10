var TaskJS = require('../lib/task');

var registry = new TaskJS.Registry();
registry.loadFile('../lib/tasks/files');
registry.loadFile('../lib/tasks/concat');
registry.loadFile('../lib/tasks/log');
registry.loadFile('../lib/tasks/inspect');

// TaskJS Style
var task = new TaskJS.TaskJS(registry)
    .files(['index.js', 'package.json', 'foo.txt', 'bar'])
    .concat()
    .inspect()
    .log('WTF!!!')
    .run();