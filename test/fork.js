var taskjs = require('../lib/task'),
    fork = require('../lib/tasks/fork').fork,
    fixtures = {
        files: ['test/fixtures/test1.js'],
        parallel_files: ['test/fixtures/test2.js']
    };

describe('taskjs.queue()', function() {
    it('should wrap task correctly', function() {
        taskjs.queue().fork({
            read_files:      {task: 'files', options: fixtures.files},
            concat_files:    {requires: ['read_files'], task: 'concat'},
            inspect_results: {requires: ['concat_files'], task: 'inspect'},
            read_files2:      {task: 'files', options: fixtures.parallel_files},
            inspect_results2: {requires: ['read_files2'], task: 'inspect'},
            inspect_1_and_2: {requires: ['inspect_results2', 'inspect_results'], task: 'log', options: 'Done'}
        }).run();
    });
});

describe('fork()', function() {
    it('should execute complex tasks', function(done) {
        fork({
            read_files:      {task: 'files', options: fixtures.files},
            concat_files:    {requires: ['read_files'], task: 'concat'},
            inspect_results: {requires: ['concat_files'], task: 'inspect'},
            read_files2:      {task: 'files', options: fixtures.parallel_files},
            inspect_results2: {requires: ['read_files2'], task: 'inspect'},
            inspect_1_and_2: {requires: ['inspect_results2', 'inspect_results'], task: 'log', options: 'Done'}
        }, [], console, function(err, results) {
            done(err);
        });
    });

    it('should accept existing data');
});