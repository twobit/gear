#!/usr/bin/env node

/* Gear task runner. Executes Gearfile using a tasks workflow.
 * See http://gearjs.org/#tasks.tasks
 *
 * Usage:
 * > gear
 */ 
var gear = require('../index'),
    vm = require('vm'),
    path = require('path'),
    fs = require('fs'),
    filename = 'Gearfile',
    existsSync = fs.existsSync || path.existsSync; // 0.6 compat

if (!existsSync(filename)) {
    notify(filename + ' not found');
    return 1;
}

try {
    var tasks = vm.runInNewContext('var tasks = ' + fs.readFileSync(filename) + '; tasks;', {
        require: require,
        process: process,
        console: console,
        gear: gear
    }, filename, true);
} catch(e) {
    notify(e);
    return 1;
}

if (tasks) {
    new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})})
        .tasks(tasks)
        .run(function(err, res) {
            if (err) {
                notify(err);
            }
        });
}

function notify(msg) {
    console.error('gear: ', msg);
}
