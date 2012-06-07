/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*
 * Bootstraps browser based Gear.js
 */
var path = require('path'),
    gear = require(path.join(process.cwd(), 'index'));

var files = [
    'vendor/async.js',
    'lib/blob.js',
    'lib/tasks/concat.js',
    'lib/tasks/core.js',
    'lib/tasks/load.js',
    'lib/tasks/tasks.js',
    'lib/tasks/write.js',
    'lib/registry.js',
    'lib/queue.js'
];

new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})})
    .load(files)
    .concat()
    .tasks({
        write: {task: 'write', options: 'build/gear.js'},
        minify: {task: 'jsminify'},
        writeminify: {task: 'write', options: 'build/gear.min.js', requires: 'minify'},
        join: {requires: ['write', 'writeminify']} // Sample join
    })
    .run(function(err, results) {
        if (err) {
            console.error(err);
        }
    });
