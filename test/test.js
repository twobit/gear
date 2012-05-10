var TaskJS = require('../lib/task');

// TaskJS Style
var task = new TaskJS()
    .files(['index.js', 'package.json', 'foo.txt', 'bar'])
    .concat()
    .inspect()
    .run();

// Buildy Style
var task2 = new TaskJS()
    .task('files', ['index.js', 'package.json', 'foo.txt', 'bar'])
    .task('concat')
    .task('inspect')
    .run();

// TaskJS Advanced
var task3 = new TaskJS().flow({
    read_files:      {task: 'files', options: [['index.js', 'test/test.js']]},
    concat_files:    {requires: ['read_files'], task: 'concat'},
    inspect_results: {requires: ['concat_files'], task: 'inspect'},
    read_files2:      {task: 'files', options: [['package.js']]},
    inspect_results2: {requires: ['read_files2'], task: 'inspect'},
    inspect_1_and_2: {requires: ['inspect_results2', 'inspect_results'], task: 'inspect'}
});