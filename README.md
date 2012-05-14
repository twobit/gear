# taskjs

## Asynchronous Task-based Build System

taskjs is a scriptable build system using simple tasks that act like a sequence of piped commands.

Features include:
 * Simple building blocks that can be combined to perform complex builds.
 * Simple tasks. Tasks simply transform input to output without relying on system internals.
 * Excellent async support.
 * Loading tasks from NPM.
 * Advanced flow control for complex task execution.

## Installation

```
npm install taskjs
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

Creates a new queue.

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

Creates a new registry.

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

 * tasks - TODO.

TODO

__Example__

```
.fork()
```

## Custom Tasks

TODO

## Special Thanks

taskjs was insprired by [Buildy](/mosen/build) created by [mosen](/mosen).