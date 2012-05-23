var path = require('path'),
    fs = require('fs'),
    write = require('../lib/tasks/write').write,
    fixtures = {
        filename: 'testing/write.txt',
        filename2: 'testing/write2.txt',
        checksum: 'testing/write_{checksum}.txt',
        checksum_replaced: 'testing/write_900150983cd24fb0d6963f7d28e17f72.txt',
        message: {body: 'abc'}
    };

function remove(filename) {
    if (path.existsSync(filename)) {
        fs.unlinkSync(filename);
    }
}

describe('write()', function() {
    it('should write file', function(done) {
        remove(fixtures.filename);
        write(fixtures.filename, fixtures.message, function(err, message) {
            path.existsSync(fixtures.filename).should.equal(true);
            done(err);
        });
    });

    it('should write file with options', function(done) {
        remove(fixtures.filename);
        write({file: fixtures.filename2}, fixtures.message, function(err, message) {
            path.existsSync(fixtures.filename2).should.equal(true);
            done(err);
        });
    });

    it('should replace {checksum} in filename', function(done) {
        remove(fixtures.checksum_replaced);
        write({file: fixtures.checksum}, fixtures.message, function(err, message) {
            path.existsSync(fixtures.checksum_replaced).should.equal(true);
            done(err);
        });
    });
});