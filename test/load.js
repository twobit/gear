var should = require('should'),
    load = require('../lib/tasks/load').load.fn,
    fixtures = {
        file: {file: 'test/fixtures/test1.js'},
        missing_file: {file: 'test/fixtures/missing_file.js'}
    };

describe('load()', function() {
    it('should read files', function(done) {
        load(fixtures.file, [], console, function(err, message) {
            done(err);
        });
    });

    it('should handle missing files', function(done) {
        load(fixtures.missing_file, [], console, function(err, message) {
            should.exist(err);
            done();
        });
    });
});