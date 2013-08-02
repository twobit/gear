/* Gear task runner. Executes Gearfile using a tasks workflow.
 * See http://gearjs.org/#tasks.tasks
 *
 * Usage:
 * > gear
 */ 
var gear = require('../index'),
    vm = require('vm'),
    fs = require('fs');

var tasks = vm.runInNewContext('var tasks = ' + fs.readFileSync('Gearfile') + '; tasks;', {
    require: require,
    process: process,
    console: console
});

new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})})
    .tasks(tasks)
    .run(function(err, res) {
        if (err) {
            console.log(err);
        }
    });