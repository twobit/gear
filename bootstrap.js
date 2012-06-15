/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*
 * Bootstraps browser based Gear.js
 */
var path = require('path'),
    gear = require(path.join(process.cwd(), 'index')),
    handlebars = require('./node_modules/gear-lib/node_modules/handlebars'),
    wrap = handlebars.compile(
        "\n\ndefine('{{name}}', ['require', 'exports'{{#modules}}, '{{.}}'{{/modules}}], function(require, exports{{#input}}, {{.}}{{/input}}) {\n\n" +
        "{{{result}}}\n\n" +
        "});\n\n"
    ),
    helper = handlebars.compile(
        "define('../blob', ['require', 'exports', 'blob'], function(require, exports, blob) {\n" +
        "exports.Blob = blob.Blob;\n" +
        "});\n\n" +
        "define('./default_tasks', ['require', 'exports'{{#tasks}}, '{{.}}'{{/tasks}}], function(require, exports) {\n" +
        "var tasks = [];\n" +
        "{{#tasks}}tasks.push(require('{{.}}'));{{/tasks}}\n" +
        "tasks.forEach(function(mod) {for (var task in mod) {exports[task] = mod[task];}});\n" +
        "});\n\n" +
        "define('gear', ['require', 'exports', 'blob', 'registry', 'queue'], function(require, exports, blob, registry, queue) {\n" +
        "exports.Blob = blob.Blob; exports.Registry = registry.Registry; exports.Queue = queue.Queue;\n" +
        "});\n\n"
    ),
    files = {
        'vendor/require.js': {},
        'node_modules/async/lib/async.js': {name: 'async', modules: ['module'], input: ['module']},
        'lib/blob.js': {name: './blob'},
        'lib/tasks/concat.js': {name: './tasks/concat', task: true},
        'lib/tasks/core.js': {name: './tasks/core', modules: ['../blob'], task: true},
        'lib/tasks/read.js': {name: './tasks/read', modules: ['../blob'], task: true},
        'lib/tasks/write.js': {name: './tasks/write', task: true},
        'lib/tasks/tasks.js': {name: './tasks/tasks', modules: ['async'], task: true},
        'lib/registry.js': {name: './registry', modules: ['./tasks/concat', './default_tasks']},
        'lib/queue.js': {name: './queue', modules: ['async', './registry', './blob']}
    },
    tasks = [];

for (var key in files) {if (files[key].task) {tasks.push(files[key].name);}}

new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})})
    .read(Object.keys(files))
    .load(helper({tasks: tasks}))
    .jslint({nomen: true, sloppy: true, white: true, vars: true, callback: function(blob) {
        //console.log(blob.name ? blob.name : 'inline', blob.jslint);
    }})
    .concat({callback: function(blob) {
        if (blob.name in files && files[blob.name].name) {
            var obj = files[blob.name];
            var vars = {result: blob.result};
            Object.keys(obj).forEach(function(attr) {vars[attr] = obj[attr];});
            return wrap(vars);
        }
        return blob.result;
    }})
    .tasks({
        dev:      {task: ['write', 'build/gear.js']},
        prodmin:  {task: 'jsminify'},
        prod:     {requires: 'prodmin', task: ['write', 'build/gear.min.js']},
        join:     {requires: ['dev', 'prod']}
    })
    .run(function(err, results) {
        if (err) {
            console.error(err);
        }
    });