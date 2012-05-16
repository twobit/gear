var should = require('should'),
    concat = require('../lib/concat').concat.fn,
    fixtures = {
        messages: [{body: 'abc'}, {body: 'def'}],
        message: [{body: 'abc'}]
    };

describe('concat()', function() {
    it('should concat objects', function(done) {
        concat(null, fixtures.messages, console, function(err, message) {
            message.body.should.equal('abcdef');
            done(err);
        });
    });

    it('should not concat one object', function(done) {
        concat(null, fixtures.message, console, function(err, message) {
            message.body.should.equal('abc');
            done(err);
        });
    });

    it('should handle empty objects', function(done) {
        concat(null, [], console, function(err, message) {
            message.body.should.equal('');
            done(err);
        });
    });
});