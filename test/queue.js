var taskjs = require('../lib/task'),
    fixtures = {
        files: ['test/fixtures/test1.js']
    };

describe('Queue', function() {
    describe('run', function() {
        it('should execute chained tasks', function(done) {
            taskjs.queue()
                .files(fixtures.files)
                .concat()
                .inspect()
                .log('Finished')
                .run(function(err, results) {
                    done(err);
                });
        });

        it('should handle forks', function(done) {
            taskjs.queue()
                .fork({
                    files: {task: 'files', options: fixtures.files},
                    log: {task: 'log', options: 'Finished', requires: ['files']}
                })
                .run(function(err, results) {
                    done(err);
                });
        });
    });
});