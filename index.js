/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var Gearbox = require('./lib/gearbox').Gearbox;
var Queue = require('./lib/queue').Queue;

var gearbox = exports.gearbox = function(options) {
    var box = new Gearbox(options);
    box.load({dirname: __dirname + '/lib/tasks'});
    return box;
};

exports.queue = function(options) {
    options = options || {};
    options.gearbox = options.gearbox || gearbox();
    return new Queue(options);
};

var tasks = [
    './lib/tasks/concat',
    './lib/tasks/load',
    './lib/tasks/tasks',
    './lib/tasks/core',
    './lib/tasks/write'
];

tasks.forEach(function(task) {
    var mod = require(task),
        name;

    for (name in mod) {
        exports[name] = mod[name];
    }
});