var core = require('taskjs-core'),
    path = require('path'),
    fixtures = {
        files: ['test/fixtures/test1.js', 'test/fixtures/test2.js']
    };

describe('Queue', function() {
    describe('run()', function() {
        it('should execute chained tasks', function(done) {
            core.createQueue({registry: core.createRegistry({filename: path.join(process.cwd(), './index.js')})})
                .files(fixtures.files)
                .concat()
                .inspect()
                .log('Finished')
                .run(function(err, results) {
                    done(err);
                });
        });

        /*
        it('should handle forks', function(done) {
            core.createQueue({registry: core.createRegistry({module: 'index.js'})})
                .fork({
                    files: {task: 'files', options: fixtures.files},
                    log: {task: 'log', options: 'Finished', requires: ['files']}
                })
                .run(function(err, results) {
                    done(err);
                });
        });
        */
    });
});