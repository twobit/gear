/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
if (typeof module !== 'undefined') {
    var fs = require('fs'),
        path = require('path'),
        existsSync = fs.existsSync || path.existsSync;
}
else { // Client side default tasks
    var default_tasks = require('./default_tasks');
}

/*
 * Registry - Container for available tasks.
 */
var Registry = exports.Registry = function Registry(options) {
    var self = this;
    this._tasks = {};

    // Load default tasks
    if (typeof __dirname !== 'undefined') {
        this.load({dirname: __dirname + '/tasks'});
    }
    else if (typeof default_tasks !== 'undefined') {
        this.load({tasks: default_tasks});
    }

    if (options) {
        this.load(options);
    }

    Object.defineProperty(this, 'tasks', {get: function() {
        return Object.keys(self._tasks);
    }});
};

Registry.prototype = {
    /*
     * Load tasks from NPM, directory, file, or object.
     */
    load: function(options) {
        options = options || {};

        if (options.module) {
            this._loadModule(options.module);
        }

        if (options.dirname) {
            this._loadDir(options.dirname);
        }

        if (options.filename) {
            this._loadFile(options.filename);
        }

        if (options.tasks) {
            this._loadTasks(options.tasks);
        }
    },

    _loadModule: function(name) {
        this._loadDir(path.resolve('node_modules', name, 'lib'));
    },

    _loadDir: function(dirname) {
        if (!existsSync(dirname)) {
            throw new Error('Directory ' + dirname + ' doesn\'t exist');
        }
        
        var fs = require('fs'),
            files = fs.readdirSync(dirname),
            self = this;

        files.forEach(function(filename) {
            self._loadFile(path.join(dirname, filename));
        });
    },

    _loadFile: function(filename) {
        if (path.extname(filename) !== '.js') {
            return;
        }

        if (!existsSync(filename)) {
            throw new Error('File ' + filename + ' doesn\'t exist');
        }

        this._loadTasks(require(filename));
    },

    _loadTasks: function(tasks) {
        var name;

        for (name in tasks) {
            this._tasks[name] = tasks[name];
        }
    },

    task: function(name) {
        if (!(name in this._tasks)) {
            throw new Error('Task ' + name + ' doesn\'t exist');
        }
        return this._tasks[name];
    }
};
