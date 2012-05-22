var should = require('should'),
    path = require('path'),
    gear = require(path.join(process.cwd(), './index')),
    fixtures = {
        files: [{file: 'test/fixtures/test1.js'}, {file: 'test/fixtures/test2.js'}],
        missing_files: [{file: 'test/fixtures/missing_file.js'}]
    };

describe('Queue', function() {
    describe('run()', function() {
        it('should execute chained tasks', function(done) {
            gear.queue()
                .load(fixtures.files)
                .concat()
                .inspect()
                .log('Finished')
                .run(function(err, results) {
                    done(err);
                });
        });

        it('should handle errors', function(done) {
            gear.queue()
                .load(fixtures.missing_files)
                .concat()
                .inspect()
                .run(function(err, results) {
                    should.exist(err);
                    done();
                });
        });
    });

    describe('run', function() {
        it('should run empty queues', function(done) {
            gear.queue()
                .run(function(err, results) {
                    done(err);
                });
        });
    });

    it('should execute task callback');
});