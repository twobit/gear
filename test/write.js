var path = require('path'),
    write = require('../lib/write').write.fn,
    fixtures = {
        filename: 'testing/write.txt',
        object: {body: 'abc'}
    };

describe('write()', function() {
    it('should write last object', function(done) {
        write({filename: fixtures.filename}, fixtures.object, console, function(err, message) {
            path.existsSync(fixtures.filename);

            done(err);
        });
    });
});