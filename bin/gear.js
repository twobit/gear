#!/usr/bin/env node
'use strict';

/* Gear task runner. Executes Gearfile using a tasks workflow.
 * See http://gearjs.org/#tasks.tasks
 *
 * Usage:
 * > gear [options]
 *
 * Available options:
 * --cwd <dir>        change working directory
 * --Gearfile <path>  execute a specific gearfile
 */
var Liftoff = require('liftoff'),
    vm = require('vm'),
    path = require('path'),
    fs = require('fs'),
    filename = 'Gearfile',
    existsSync = fs.existsSync || path.existsSync; // 0.6 compat

var GearCLI = new Liftoff({
    name: 'Gear',
    configName: filename,
    extensions: {
        '': null,
        '.js': null
    }
});

GearCLI.launch(function(env) {
    // Loads a local install of gear. Falls back to the global install.
    var gear = require(env.modulePath || '../index');
    if(process.cwd !== env.cwd) {
        process.chdir(env.cwd);
    }

    if (!env.configPath) {
        notify(filename + ' not found');
        process.exit(1);
    }

    var tasks;
    try {
        tasks = vm.runInNewContext('var tasks = ' + fs.readFileSync(filename) + '; tasks;', {
            require: require,
            process: process,
            console: console,
            gear: gear
        }, env.configPath, true);
    } catch(e) {
        notify(e);
        process.exit(1);
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
});


function notify(msg) {
    console.error('gear: ', msg);
}
