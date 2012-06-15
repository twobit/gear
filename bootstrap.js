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
    handlebars = require('./node_modules/gear-lib/node_modules/handlebars');

var tmpl = handlebars.compile(
    "\n\ndefine('{{name}}', ['require', 'exports'{{#modules}}, '{{.}}'{{/modules}}], function(require, exports{{#input}}, {{.}}{{/input}}) {\n\n" +
    "{{{result}}}\n\n" +
    "});\n\n"
);

var helper = handlebars.compile(
    "define('../blob', ['require', 'exports', 'blob'], function(require, exports, blob) {\n" +
    "exports.Blob = blob.Blob;\n" +
    "});\n\n" +
    "define('./default_tasks', ['require', 'exports'{{#tasks}}, '{{.}}'{{/tasks}}], function(require, exports) {\n" +
    "var tasks = [];\n" +
    "{{#tasks}}tasks.push(require('{{.}}'));{{/tasks}}\n" +
    "tasks.forEach(function(mod) {for (var task in mod) {exports[task] = mod[task];}});\n" +
    "});\n\n"
);

var files = {
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
};

var tasks = [];
for (var task in files) {
    if (files[task].task) {
        tasks.push(files[task].name);
    }
}

new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})})
    .read(Object.keys(files))
    .jslint({nomen: true, sloppy: true, white: true, vars: true, callback: function(blob) {
        //console.log(blob.name ? blob.name : 'inline', blob.jslint);
    }})
    .concat({callback: function(blob) {
        var obj = files[blob.name];
        if (obj.name) {
            var vars = {result: blob.result, modules: []};
            Object.keys(obj).forEach(function(attr) {vars[attr] = obj[attr];});
            //Object.keys(vars.modules).forEach(function(attr) {vars.paths[attr] = obj[attr];});
            return tmpl(vars);
        }
        return blob.result;
    }})
    .load(helper({tasks: tasks}))
    .concat()
    .tasks({
        dev:      {task: ['write', 'build/gear.js']}
        /*
        fullraw: {task: ['read', 'node_modules/gear-lib/build/gear-lib.js']},
        full: {requires: 'fullraw', task: 'concat'},
        devfull: {requires: 'full', task: ['write', 'build/gear-full.js']},
        prodfullmin: {requires: 'full', task: 'jsminify'},
        prodfull: {requires: 'prodfullmin', task: ['write', 'build/gear-full.min.js']},

        prodmin:  {task: 'jsminify'},
        prod:     {requires: 'prodmin', task: ['write', 'build/gear.min.js']},
        
        join:     {requires: ['dev', 'devfull', 'prod', 'prodfull']}
        */
    })
    .run(function(err, results) {
        if (err) {
            console.error(err);
        }
    });