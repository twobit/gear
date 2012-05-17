# taskjs

## Task-Based Build System

taskjs is a scriptable build system using simple tasks that act like a sequence of piped commands.

Features include:
 * Basic building blocks that can be combined to perform complex builds.
 * Tasks simply transform input to output without relying on system internals.
 * Asynchronous execution.
 * Extensible task loading via NPM, file, or directory.
 * Advanced flow control for complex task execution.

## Installation

To get the most out of taskjs, you will want to install [taskjs-lib](/twobit/taskjs-lib) which contains tasks for linting, minifying, and deploying JS/CSS assets.

```
npm install taskjs
npm install taskjs-lib
```

## Quick Examples

### Chaining Tasks

```
taskjs.queue()
 .load([{file: 'foo.js'}, {file: 'bar.js'}, {file: 'baz.js'}]
 .concat()
 .write({name: 'foobarbaz.js'})
 .run();
```

### Complex Task Execution

```
taskjs.queue()
 .load([{file: 'foo.js'}])
 .log('Complex Task')
 .fork({
    read: {task: 'load', options: [{file: 'foo.js'}, {file: 'bar.js'}, {file: 'baz.js'}]}
    combine: {task: 'concat', requires: ['read']}
    output: {task: 'jsminify', requires: ['combine']}
    print: {task: 'inspect', requires: ['read', 'combine', 'output']}
 }).run();
```

## Documentation

### [Core](#Core)

 * [queue](#Core.queue)
 * [Queue.task](#Core.Queue.task)
 * [Queue.run](#Core.Queue.run)
 * [registry](#Core.registry)
 * [Registry.load](#Core.Registry.load)

### [Tasks](#Tasks)

 * [load](#Tasks.load)
 * [write](#Tasks.write)
 * [concat](#Tasks.concat)
 * [inspect](#Tasks.inspect)
 * [log](#Tasks.log)
 * [fork](#Tasks.fork)

### [Custom Tasks](#Custom)

<a name="Core" />
## Core

<a name="Core.queue" />
### queue(options)

Creates a new Queue instance.

__Arguments__

 * options.registry - Registry with available tasks.

__Example__

```
taskjs.queue()
 .log('test')
 .run();
```

---------------------------------------

<a name="Core.Queue.task" />
### Queue.task(name, options)

Runs the specified task.

__Arguments__

 * name - Name of task in registry.

__Example__

```
taskjs.queue()
 .task('log', 'Hello, world!')
 .run();
```

---------------------------------------

<a name="Core.Queue.run" />
### Queue.run()

Runs the queue.

__Example__

```
taskjs.queue()
 .log('test')
 .run();
```

---------------------------------------

<a name="Core.registry" />
### registry()

Creates a new Registry instance.

__Example__

```
taskjs.registry();
```

---------------------------------------

<a name="Core.Registry.load" />
### Registry.load(options)

Load from NPM, directory, or file.

__Arguments__

 * options.module - Module to load tasks from.
 * options.dirname - Directory to load tasks from.
 * options.filename - File to load tasks from.

__Example__

```
taskjs.registry().load({dirname: 'foo'});
```

---------------------------------------

<a name="Tasks" />
## Tasks

<a name="Tasks.load" />
### load(sources)

Loads messages from different sources.

__Arguments__

 * sources - List of sources.

__Example__

```
// source - What resource to load.
// source.file - Filename of resource.
.load([{file: 'foo'}, {file: 'bar'}, {file: 'baz'}])
```

---------------------------------------

<a name="Tasks.write" />
### write(options)

__Arguments__

 * options.filename - File to write.

Write the message to disk.

__Example__

```
.write({filename: 'foo'})
```

---------------------------------------

<a name="Tasks.concat" />
### concat()

Concatenates messages.

__Example__

```
.concat()
```

---------------------------------------

<a name="Tasks.inspect" />
### inspect()

Inspects a message.

__Example__

```
.inspect()
```

---------------------------------------

<a name="Tasks.log" />
### log(message)

__Arguments__

 * message - Message to log.

Log a message.

__Example__

```
.log('Finished')
```

---------------------------------------

<a name="Tasks.fork" />
### fork(tasks)

__Arguments__

 * tasks - Task workflow.

Fork execution into parallel tasks with optional dependencies. Data is joined on fork completion.

__Example__

```
// label - Task instance name.
// label.task - Task name.
// label.options - Task options.
// label.requires - List of labels that must be executed before this task runs.
.fork({
    label_1: {task: 'log', options: 'Hello, world!'}
    label_2: {task: 'log', options: 'Hello, world 2!', requires: ['label_1']}
})
```

<a name="Custom" />
## Custom Tasks

Writing a task is especially easy compared to other Node build systems. There is no need to use taskjs internals within a task. Tasks operate on immutable messages. Messages have a body property. The task returns transformed data via its callback.

__Arguments__

 * options - Options for the task.
 * messages - Immutable list of messages created by other tasks. Messages must each have a body property.
 * logger - Logger for outputting status.
 * callback(err, results) - Callback executed when task is complete.

__Example__
```
// example.js
// Example task replaces each message body with a string.
exports.example = function(string, message, logger, callback) {
    callback(null, {body: string});
};
```

__Running Example Task__

```
taskjs.queue({registry: taskjs.registry({filename: 'example.js'})})
 .example('EXAMPLE')
 .run();
```

## Special Thanks

taskjs takes inspiration from a few sources:

 * [Thread Building Blocks](http://threadingbuildingblocks.org/) by Intel.
 * [buildy](/mosen/build) created by [mosen](/mosen).
 * [grunt](/cowboy/grunt) created by [cowboy](/cowboy).
