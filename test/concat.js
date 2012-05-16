var concat = require('../lib/tasks/concat').concat.fn,
    fixtures = {
        objects: [{meta: {}, content: 'abc'}, {meta: {}, content: 'def'}],
        object: [{meta: {}, content: 'abc'}]
    };

describe('concat()', function() {
    it('should concat objects', function(done) {
        concat(null, fixtures.objects, console, function(err, objects) {
            objects.should.have.lengthOf(1);
            objects[0].content.should.equal('abcdef');
            done(err);
        });
    });

    it('should not concat one object', function(done) {
        concat(null, fixtures.object, console, function(err, objects) {
            objects.should.have.lengthOf(1);
            objects[0].content.should.equal('abc');
            done(err);
        });
    });

    it('should handle empty objects', function(done) {
        concat(null, [], console, function(err, objects) {
            objects.should.have.lengthOf(0);
            done(err);
        });
    });
});