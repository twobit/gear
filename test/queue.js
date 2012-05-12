var should = require('should'),
    Queue = require('../lib/task').Queue,
    fixtures = {
        files: ['test/fixtures/test1.js']
    };

describe('Queue', function() {
    describe('run', function() {
        it('should execute chained tasks', function(done) {
            var queue = new Queue()
                .files(fixtures.files)
                .concat()
                .inspect()
                .log('Finished')
                .run(function(err, results) {
                    done(err);
                });
        });

        it('should handle forks', function(done) {
            var queue = new Queue()
                .fork()
                .files(fixtures.files)
                .concat()
                .inspect()
                .log('Finished')
                .run(function(err, results) {
                    done(err);
                });
        });
    });
});