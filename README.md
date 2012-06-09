# Gear.js

## Task-Based Build System

Gear.js is a scriptable build system using simple tasks that act like a sequence of piped commands.

Features include:
 * Runs in Node and the browser.
 * Basic building blocks that can be combined to perform complex builds.
 * Tasks are simply defined and keep system internals to a minimum.
 * Asynchronous execution.
 * Extensible task loading via NPM, file, or directory.
 * Advanced flow control for complex task execution.

## Installation

To get the most out of Gear.js, you will want to install [gear-lib](/twobit/gear-lib) which contains tasks for linting, minifying, and deploying JS/CSS assets.

```bash
$ npm install gear
$ npm install gear-lib
```

## Quick Examples

### Chaining Tasks

```javascript
new Queue()
 .read('foo.js')
 .log('read foo.js')
 .inspect()
 .write('foobarbaz.js')
 .run();
```

### Execute Tasks Using Array Style

```javascript
new Queue()
 .read(['foo.js', {name: 'bar.js'}, 'baz.js'])
 .log('read foo.js')
 .inspect()
 .write(['newfoo.js', 'newbar.js']) // Not writing 'baz.js'
 .run();
```

### Parallel Task Execution

```javascript
new Queue()
 .read('foo.js')
 .log('Parallel Tasks')
 .tasks({
    read:     {task: ['read', ['foo.js', 'bar.js', 'baz.js']]}
    combine:  {requires: 'read', task: 'concat'}
    minify:   {requires: 'combine', task: 'jsminify'}
    print:    {requires: ['read', 'combine', 'minify'], task: 'inspect'} // Runs when read, combine, and minify complete
    parallel: {task: ['log', "Hello Gear.js world!"]} // Run parallel to read
 }).run();
```

[Documentation](http://yahoo.github.com/gear)
[Issues](http://github.com/yahoo/gear/issues)