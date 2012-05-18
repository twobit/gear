var Queue = require('../lib/queue').Queue;

describe('Queue', function() {
    describe('run', function() {
        it('should run empty queues', function(done) {
            new Queue()
                .run(function(err, results) {
                    done(err);
                });
        });
    });

    it('should execute task callback');
});