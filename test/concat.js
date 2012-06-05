var should = require('should'),
    concat = require('../lib/tasks/concat').concat,
    fixtures = {
        prev: {body: 'abc'},
        cur: {body: 'def'}
    };

describe('concat()', function() {
    it('should concat blobs', function(done) {
        concat(null, fixtures.prev, fixtures.cur, function(err, blob) {
            blob.body.should.equal('abcdef');
            done(err);
        });
    });
});