var lib = process.env.GEAR_COVER ? '../lib-cov/' : '../lib/',
    file = require(lib + 'file').file,
    should = require('should');

describe('file', function() {

    describe('readJSON', function() {
        it('should read JSON', function() {
            var res = file.readJSON('./test/fixtures/test.json');
            res.x.should.equal(12);
        });

        it('should not read JSONC', function() {
            should(function() {
                file.readJSON('./test/fixtures/test.jsonc');
            }).throw();
        });
    });

    describe('readJSONC', function() {
        it('should read JSON', function() {
            var res = file.readJSONC('./test/fixtures/test.json');
            res.x.should.equal(12);
        });

        it('should read JSONC', function() {
            var res = file.readJSONC('./test/fixtures/test.jsonc');
            res.x.should.equal(12);
        });
    });

});