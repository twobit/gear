var Blob = require('../lib/blob').Blob;

describe('Blob', function() {
    describe('constructor()', function() {
        it('should accept mixed input', function() {
            (new Blob('abcdef')).toString().should.equal('abcdef');
            (new Blob(['abc', 'def'])).toString().should.equal('abcdef');
            (new Blob(['abc', new Blob('def')])).toString().should.equal('abcdef');
        });
    });
});