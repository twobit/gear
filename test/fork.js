var should = require('should'),
    path = require('path'),
    core = require('taskjs-core'),
    fork = require('../lib/fork').fork.fn,
    fixtures = {
        files: [{file: 'test/fixtures/test1.js'}],
        missing_files: [{file: 'test/fixtures/missing_file.js'}],
        parallel_files: [{file: 'test/fixtures/test2.js'}]
    };

describe('taskjs.queue()', function() {
    it('should wrap task correctly', function() {
        var registry = core.createRegistry({filename: path.join(process.cwd(), './index.js')});
        core.createQueue({registry: registry}).fork({
            read_files:      {task: 'load', options: fixtures.files},
            concat_files:    {requires: ['read_files'], task: 'concat'},
            inspect_results: {requires: ['concat_files'], task: 'inspect'},
            read_files2:      {task: 'load', options: fixtures.parallel_files},
            inspect_results2: {requires: ['read_files2'], task: 'inspect'},
            inspect_1_and_2: {requires: ['inspect_results2', 'inspect_results'], task: 'log', options: 'Done'}
        }).run();
    });
});

describe('fork()', function() {
    it('should handle err', function(done) {
        var registry = {
            _registry: core.createRegistry({filename: path.join(process.cwd(), './index.js')})
        };

        fork.call(registry, {
            read_files:      {task: 'load', options: fixtures.missing_files}
        }, [], console, function(err, results) {
            should.exist(err);
            done();
        });
    });

    it('should execute complex tasks', function(done) {
        var registry = {
            _registry: core.createRegistry({filename: path.join(process.cwd(), './index.js')})
        };

        fork.call(registry, {
            read_files:      {task: 'load', options: fixtures.files},
            concat_files:    {requires: ['read_files'], task: 'concat'},
            inspect_results: {requires: ['concat_files'], task: 'inspect'},
            read_files2:      {task: 'load', options: fixtures.parallel_files},
            inspect_results2: {requires: ['read_files2'], task: 'inspect'},
            inspect_1_and_2: {requires: ['inspect_results', 'inspect_results2'], task: 'log', options: 'Done'}
        }, [], console, function(err, results) {
            done(err);
        });
    });

    it('should accept existing data');
});