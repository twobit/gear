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
/*
// TaskJS Advanced
var task3 = new TaskJS().flow({
    read_files: {task: 'files', options: ['index.js']},
    concat_files: {task: 'concat', requires: ['read_files']},
    inspect_results: {task: 'inspect', requires: ['concat_files']}
});*/