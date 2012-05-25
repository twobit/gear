var should = require('should'),
    load = require('../lib/tasks/load').load,
    fixtures = {
        filename: 'test/fixtures/test1.js',
        file: {file: 'test/fixtures/test1.js'},
        missing_file: {file: 'test/fixtures/missing_file.js'}
    };

describe('load()', function() {
    it('should handle filenames instead of objects', function(done) {
        load(fixtures.filename, function(err, message) {
            done(err);
        });
    });

    it('should read files', function(done) {
        load(fixtures.file, function(err, message) {
            done(err);
        });
    });

    it('should handle missing files', function(done) {
        load(fixtures.missing_file, function(err, message) {
            should.exist(err);
            done();
        });
    });
});