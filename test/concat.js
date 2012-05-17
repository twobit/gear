var should = require('should'),
    concat = require('../lib/tasks/concat').concat.fn,
    fixtures = {
        messages: [{body: 'abc'}, {body: 'def'}],
        message: [{body: 'abc'}]
    };

describe('concat()', function() {
    it('should concat messages', function(done) {
        concat(null, fixtures.messages, function(err, message) {
            message.body.should.equal('abcdef');
            done(err);
        });
    });

    it('should not concat one message', function(done) {
        concat(null, fixtures.message, function(err, message) {
            message.body.should.equal('abc');
            done(err);
        });
    });

    it('should handle empty messages', function(done) {
        concat(null, [], function(err, message) {
            message.body.should.equal('');
            done(err);
        });
    });
});