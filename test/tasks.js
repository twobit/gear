var should = require('should'),
    core = require('taskjs-core'),
    path = require('path'),
    fixtures = {
        files: [{file: 'test/fixtures/test1.js'}, {file: 'test/fixtures/test2.js'}],
        missing_files: [{file: 'test/fixtures/missing_file.js'}]
    };

describe('Queue', function() {
    describe('run()', function() {
        var options = {registry: core.createRegistry({filename: path.join(process.cwd(), './index.js')})};

        it('should execute chained tasks', function(done) {
            core.createQueue(options)
                .load(fixtures.files)
                .concat()
                .inspect()
                .log('Finished')
                .run(function(err, results) {
                    done(err);
                });
        });

        it('should handle errors', function(done) {
            core.createQueue(options)
                .load(fixtures.missing_files)
                .concat()
                .inspect()
                .run(function(err, results) {
                    should.exist(err);
                    done();
                });
        });

        it('should handle forks', function(done) {
            core.createQueue(options)
                .fork({
                    load: {task: 'load', options: fixtures.files},
                    log: {task: 'log', options: 'Finished', requires: ['load']}
                })
                .run(function(err, results) {
                    done(err);
                });
        });
    });
});