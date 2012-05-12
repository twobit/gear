var should = require('should'),
    path = require('path'),
    write = require('../lib/tasks/write').write,
    fixtures = {
        filename: 'testing/write.txt',
        objects: [{meta: {}, content: 'abc'}, {meta: {}, content: 'def'}],
        object: [{meta: {}, content: 'abc'}]
    };

describe('write()', function() {
    it('should write last object', function(done) {
        write({filename: fixtures.filename}, fixtures.objects, console, function(err, objects) {
            path.existsSync(fixtures.filename);

            done(err);
        });
    });
});