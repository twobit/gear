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
    filename = 'Gearfile';

if (!fs.existsSync(filename)) {
    notify(filename + ' not found');
    return 1;
}

try {
    var tasks = vm.runInNewContext('var tasks = ' + fs.readFileSync(filename) + '; tasks;', {
        require: require,
        process: process,
        console: console
    });
} catch(e) {
    notify(e);
    return 1;
}

new gear.Queue({registry: new gear.Registry({module: path.join(__dirname, '../node_modules/gear-lib')})})
    .tasks(tasks)
    .run(function(err, res) {
        if (err) {
            notify(err);
        }
    });

function notify(msg) {
    console.error('gear: ' + msg);
}