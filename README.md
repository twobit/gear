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

```
npm install taskjs
```

To get the most out of taskjs, you will want to install [taskjs-lib](/twobit/taskjs-lib) which contains tasks for linting, minifying, and deploying JS/CSS assets:

```
npm install taskjs-lib
```

## Quick Examples

### Chaining Tasks

```
taskjs.queue()
 .files(['foo.js', 'bar.js', 'baz.js']
 .concat()
 .write({name: 'foobarbaz.js'})
 .run();
```

### Complex Task Execution

```
taskjs.queue().fork({
    read: {task: 'files', options: ['foo.js', 'bar.js', 'baz.js']}
    combine: {task: 'concat', requires: ['read']}
    output: {task: 'jsminify', requires: ['combine']}
    print: {task: 'inspect', requires: ['read', 'combine', 'output']}
}).run();
```

## Documentation

### Core

 * [queue](#queue)
 * [Queue.task](#Queue.task)
 * [Queue.run](#Queue.run)
 * [registry](#registry)
 * [Registry.load](#Registry.load)

### Tasks

 * [files](#files)
 * [write](#write)
 * [concat](#concat)
 * [inspect](#inspect)
 * [log](#log)
 * [fork](#fork)

## Core

<a name="queue" />
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

<a name="Queue.task" />
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

<a name="Queue.run" />
### Queue.run()

Runs the queue.

__Example__

```
taskjs.queue()
 .log('test')
 .run();
```

---------------------------------------

<a name="registry" />
### registry()

Creates a new Registry instance.

__Example__

```
taskjs.registry();
```

---------------------------------------

<a name="Registry.load" />
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

## Tasks

<a name="files" />
### files(filenames)

Adds objects loaded from files to object chain.

__Arguments__

 * filenames - List of filenames.

__Example__

```
.files(['foo', 'bar', 'baz'])
```

---------------------------------------

<a name="write" />
### write(options)

__Arguments__

 * options.filename - File to write.

Write the last object in the object chain.

__Example__

```
.write({filename: 'foo'})
```

---------------------------------------

<a name="concat" />
### concat()

Concatenates object chain contents.

__Example__

```
.concat()
```

---------------------------------------

<a name="inspect" />
### inspect()

Inspects object chain.

__Example__

```
.inspect()
```

---------------------------------------

<a name="log" />
### log(message)

__Arguments__

 * message - Message to log.

Log a message.

__Example__

```
.log('Finished')
```

---------------------------------------

<a name="fork" />
### fork(tasks)

__Arguments__

 * tasks - Object containing tasks to run. Format is:
 {Label: {task: Task, options: Options, requires: Requires}}
 where
  1. Label - Task instance name.
  2. Task - Task name.
  3. Options - Task options.
  4. Requires - List of labels that must be executed before this task runs.

__Example__

```
.fork({
    output: {task: 'log', options: 'Hello, world!'}
    output2: {task: 'log', options: 'Hello, world 2!'}
})
```

## Custom Tasks

Writing a task is especially easy compared to other Node build systems. There is no need to use taskjs internals within a task. Tasks simply transform input to output like a piped command. Input is immutable, the task returns transformed data via a callback.

__Arguments__

 * options - Options for the task.
 * objects - Immutable list of objects created by other tasks. Objects must each have a content property.
 * logger - Logger for outputting status.
 * callback(err, results) - Callback executed when task is complete.

__Example__
```
// example.js
// Example task replaces each objects content with a string.
exports.example = function(options, objects, logger, callback) {
    objects.map(function(item) {
        return {content: options};
    });

    callback(null, objects);
};
```

__Running Example Task__

```
taskjs.queue({registry: taskjs.registry({filename: 'example.js'})})
 .example('EXAMPLE')
 .run();
```

## Special Thanks

taskjs was insprired by [Buildy](/mosen/build) created by [mosen](/mosen).