var lib = process.env.GEAR_COVER ? '../lib-cov/' : '../lib/',
    Registry = require(lib + 'registry').Registry,
    path = require('path'),
    fixtures = {
        dirname: path.join(process.cwd(), "test/fixtures/test-tasks"),
        filename: path.join(process.cwd(), "test/fixtures/test-tasks/index.js")
    };

describe('Registry', function() {
    describe('load()', function() {
        it('should load modules', function() {
            var registry = new Registry();
            
            registry.load({module: 'gear-lib'});
            
            registry.tasks.should.include('csslint');
            registry.tasks.should.include('jslint');
            registry.tasks.should.include('s3');
            registry.tasks.should.include('glob');
        });
        
        it('should load directories', function() {
            var registry = new Registry();
            
            registry.load({dirname: fixtures.dirname});
            
            registry.tasks.should.include('fooga');
        });
        
        
        it('should load files', function() {
            var registry = new Registry();
            
            registry.load({filename: fixtures.filename});
            
            registry.tasks.should.include('fooga');
        });

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
