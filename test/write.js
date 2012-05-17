var path = require('path'),
    write = require('../lib/write').write.fn,
    fixtures = {
        filename: 'testing/write.txt',
        message: {body: 'abc'}
    };

describe('write()', function() {
    it('should write last message', function(done) {
        write({file: fixtures.filename}, fixtures.message, console, function(err, message) {
            path.existsSync(fixtures.filename);

            done(err);
        });
    });
});