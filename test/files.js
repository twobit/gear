var should = require('should'),
    files = require('../lib/files').files.fn,
    fixtures = {
        file: 'test/fixtures/test1.js',
        missing_file: 'test/fixtures/missing_file.js'
    };

describe('files()', function() {
    it('should read files', function(done) {
        files(fixtures.file, [], console, function(err, message) {
            done(err);
        });
    });

    it('should handle missing files', function(done) {
        files(fixtures.missing_file, [], console, function(err, message) {
            should.exist(err);
            done();
        });
    });
});