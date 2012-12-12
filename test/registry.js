var Registry = require('../lib/registry').Registry;

describe('Registry', function() {
    describe('load()', function() {
        it('should load modules');
        it('should load directories');
        it('should load files');
        
        it('should allow for chaining #load', function() {
            var registry = new Registry();
            
            registry.load({
                tasks : {
                    fooga : function() {}
                }
            }).tasks.should.eql(registry.tasks);
        });
    });
});
