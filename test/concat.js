var should = require('should'),
    concat = require('../lib/tasks/concat').concat,
    fixtures = {
        prev: {body: 'abc'},
        cur: {body: 'def'}
    };

describe('concat()', function() {
    it('should concat messages', function(done) {
        concat(null, fixtures.prev, fixtures.cur, function(err, message) {
            message.body.should.equal('abcdef');
            done(err);
        });
    });
});