var should = require('should'),
    path = require('path'),
    taskjs = require(path.join(process.cwd(), './index')),
    fixtures = {
        files: [{file: 'test/fixtures/test1.js'}, {file: 'test/fixtures/test2.js'}],
        missing_files: [{file: 'test/fixtures/missing_file.js'}]
    };

describe('Queue', function() {
    describe('run()', function() {
        it('should execute chained tasks', function(done) {
            taskjs.queue()
                .load(fixtures.files)
                .concat()
                .inspect()
                .log('Finished')
                .run(function(err, results) {
                    done(err);
                });
        });

        it('should handle errors', function(done) {
            taskjs.queue()
                .load(fixtures.missing_files)
                .concat()
                .inspect()
                .run(function(err, results) {
                    should.exist(err);
                    done();
                });
        });

        it('should handle forks', function(done) {
            taskjs.queue()
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