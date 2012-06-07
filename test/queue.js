var should = require('should'),
    path = require('path'),
    gear = require(path.join(process.cwd(), './index')),
    fixtures = {
        file: {name: 'test/fixtures/test1.js'},
        files: [{name: 'test/fixtures/test1.js'}, {name: 'test/fixtures/test2.js'}],
        missing_file: {name: 'test/fixtures/missing_file.js'}
    };

describe('Queue', function() {
    describe('run()', function() {
        it('should handle append tasks', function(done) {
            new gear.Queue()
                .load(fixtures.files)
                .load(fixtures.file)
                .run(function(err, results) {
                    results.should.have.length(3);
                    done(err);
                });
        });

        it('should handle tasks called with array options', function(done) {
            new gear.Queue()
                .load(fixtures.files)
                .concat()
                .run(function(err, results) {
                    done(err);
                });
        });

        it('should execute chained tasks', function(done) {
            new gear.Queue()
                .load(fixtures.file)
                .concat()
                .run(function(err, results) {
                    done(err);
                });
        });

        it('should handle errors', function(done) {
            new gear.Queue()
                .load(fixtures.missing_file)
                .concat()
                .run(function(err, results) {
                    should.exist(err);
                    done();
                });
        });
    });

    describe('run', function() {
        it('should run empty queues', function(done) {
            new gear.Queue()
                .run(function(err, results) {
                    done(err);
                });
        });
    });

    it('should execute task callback');
});