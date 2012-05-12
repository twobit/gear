# TaskJS

## Asynchronous Task-based Build System

TaskJS is a scriptable build system using simple tasks that acts like a sequence of piped commands.

Features include:
 * Simple building blocks that can be combined to perform complex builds.
 * Simple tasks. Tasks simply transform input to output without relying on system internals.
 * Excellent async support.
 * Loading tasks from NPM.
 * Advanced flow control for complex task execution.

## Quick Examples

### Chaining Tasks

```
new taskjs.Queue()
 .files(['foo.js', 'bar.js', 'baz.js']
 .concat()
 .jsminify()
 .inspect()
 .run();
```

### Complex Task Execution

```
taskjs.flow({
    readjs: {task: 'read', params: ['foo.js', 'bar.js', 'baz.js']}
    concatjs: {task: 'concat', requires: ['readjs']}
    jsminify: {task: 'jsminify', requires: ['concatjs']}
    inspectjs: {task: 'inspect', requires: ['concatjs', 'jsminify']}
});
```

## Documentation

### Core Tasks

 * [files](#files)
 * [write](#write)
 * [fork](#fork)
 * [flow](#flow)
 * [concat](#concat)
 * [inspect](#inspect)
 * [log](#log)

## Core Tasks

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

<a name="fork" />
### fork(tasks)

__Arguments__

 * tasks - TODO.

TODO

 __Example__

 ```
    .fork()
 ```

---------------------------------------

<a name="fork" />
### flow(workflow)

__Arguments__

 * workflow - TODO.

TODO

 __Example__

 ```
    .workflow()
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


## Custom Tasks

TODO

## Special Thanks

TaskJS was insprired by [Buildy](/mosen/build) created by [mosen](/mosen).
