/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var Registry = require('./lib/registry').Registry;
var Queue = require('./lib/queue').Queue;

var registry = exports.registry = function(options) {
    var reg = new Registry(options);
    reg.load({dirname: __dirname + '/lib/tasks'});
    return reg;
};

exports.queue = function(options) {
    options = options || {};
    options.registry = options.registry || registry();
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