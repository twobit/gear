var TaskJS = require('../lib/task');

new TaskJS.Flow().flow({
    read_files:      {task: 'files', params: ['index.js', 'test/queue.js']},
    concat_files:    {requires: ['read_files'], task: 'concat'},
    inspect_results: {requires: ['concat_files'], task: 'inspect'},
    read_files2:      {task: 'files', params: ['package.js']},
    inspect_results2: {requires: ['read_files2'], task: 'inspect'},
    inspect_1_and_2: {requires: ['inspect_results2', 'inspect_results'], task: 'inspect'}
}, function(err, results) {
    console.log('Finished');
});