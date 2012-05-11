var should = require('should'),
    concat = require('../../lib/tasks/concat').concat,
    fixtures = {
        objects: [{meta: {}, content: 'abc'}, {meta: {}, content: 'def'}],
        object: []
    };

describe('concat()', function() {
    it('should concat objects', function(done) {
        concat(null, fixtures.objects, console, function(err, objects) {
            objects.should.have.lengthOf(1);
            objects[0].content.should.equal('abcdef');
            done(err);
        });
    });
});