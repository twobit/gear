var should = require('should'),
    path = require('path'),
    gear = require(path.join(process.cwd(), './index')),
    tasks = require('../lib/tasks/tasks').tasks,
    fixtures = {
        files: [{name: 'test/fixtures/test1.js'}],
        missing_files: [{name: 'test/fixtures/missing_file.js'}],
        parallel_files: [{name: 'test/fixtures/test2.js'}]
    };

describe('Queue()', function() {
    it('should wrap task correctly', function() {
        new gear.Queue().tasks({
            read_files:       {task: ['read', fixtures.files]},
            concat_files:     {requires: 'read_files', task: 'concat'},
            inspect_results:  {requires: 'concat_files', task: 'inspect'},
            read_files2:      {task: ['read', fixtures.parallel_files]},
            inspect_results2: {requires: 'read_files2', task: 'inspect'},
            inspect_1_and_2:  {requires: ['inspect_results2', 'inspect_results'], task: ['log', 'Done']}
        }).run();
    });
});

describe('tasks()', function() {
    it('should handle err', function(done) {
        var queue = new gear.Queue();

        tasks.call(queue, {
            read_files:      {task: ['read', fixtures.missing_files]}
        }, [], function(err, results) {
            should.exist(err);
            done();
        });
    });

    it('should execute complex tasks', function(done) {
        var queue = new gear.Queue();

        tasks.call(queue, {
            read_files:       {task: ['read', fixtures.files]},
            concat_files:     {requires: 'read_files', task: 'concat'},
            inspect_results:  {requires: 'concat_files', task: 'inspect'},
            read_files2:      {task: ['read', fixtures.parallel_files]},
            inspect_results2: {requires: 'read_files2', task: 'inspect'},
            inspect_1_and_2:  {requires: ['inspect_results', 'inspect_results2'], task: ['log', 'Done']}
        }, [], function(err, results) {
            done(err);
        });
    });

    it('should accept existing data');
});