var path = require('path'),
    gear = require(path.join(process.cwd(), 'index'));

/*
var files = [
    '../lib/tasks/concat',
    '../lib/tasks/load',
    '../lib/tasks/tasks',
    '../lib/tasks/core',
    '../lib/tasks/write'
];

gear.queue()
    .load('build/builder.js')
    .log('hello')
    .run();

console.log(gear);*/