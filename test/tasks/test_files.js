var should = require('should'),
    files = require('../../lib/tasks/files').files,
    fixtures = {
        file: 'fixtures/test1.js',
        missing_file: 'fixtures/missing_file.js'
    };

describe('files()', function() {
    it('should read files', function(done) {
        files([fixtures.file], [], console, function(err, objects) {
            should.not.exist(err);
            objects.should.have.lengthOf(1);
            done(err);
        });
    });

    it('should handle missing files', function(done) {
        files([fixtures.missing_file], [], console, function(err, objects) {
            should.exist(err);
            done();
        });
    });
});