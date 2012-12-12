var Registry = require('../lib/registry').Registry;

describe('Registry', function() {
    describe('load()', function() {
        it('should load modules', function() {
            var registry = new Registry();
            
            registry.load({ module : 'gear-lib' });
            
            registry.tasks.should.include('csslint');
            registry.tasks.should.include('jslint');
            registry.tasks.should.include('s3');
            registry.tasks.should.include('glob');
        });
        
        it.skip('should load directories', function() {
            var registry = new Registry();
            
            registry.load({ dirname : "./test/fixtures/test-tasks" });
            
            registry.tasks.should.include('fooga');
        });
        
        it.skip('should load files', function() {
            var registry = new Registry();
            
            registry.load({ filename : "./test/fixtures/test-tasks/index.js" });
            
            registry.tasks.should.include('fooga');
        });
    });
});
