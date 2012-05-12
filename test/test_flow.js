var should = require('should'),
    Flow = require('../lib/task').Flow,
    fixtures = {
        files: ['test/fixtures/test1.js'],
        parallel_files: ['test/fixtures/test2.js']
    };

describe('Flow', function() {
    describe('flow', function() {
        it('should execute complex flows', function(done) {
            new Flow().flow({
                read_files:      {task: 'files', params: fixtures.files},
                concat_files:    {requires: ['read_files'], task: 'concat'},
                inspect_results: {requires: ['concat_files'], task: 'inspect'},
                read_files2:      {task: 'files', params: fixtures.parallel_files},
                inspect_results2: {requires: ['read_files2'], task: 'inspect'},
                inspect_1_and_2: {requires: ['inspect_results2', 'inspect_results'], task: 'log', params: 'Done'}
            }, function(err, results) {
                done(err);
            });
        });
    });
});