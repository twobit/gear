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
    } else if (typeof default_tasks !== 'undefined') {
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

        var module = options.module,
            dirname = options.dirname,
            filename = options.filename,
            tasks = options.tasks;

        if (module) {
            if (!this._loadModule(module)) {
                throw new Error('Module ' + module + ' doesn\'t exist');
            }
        }

        if (dirname) {
            if (!this._loadDir(dirname)) {
                throw new Error('Directory ' + dirname + ' doesn\'t exist');
            }
        }

        if (filename) {
            if (!this._loadFile(filename)) {
                throw new Error('File ' + filename + ' doesn\'t exist');
            }
        }

        if (tasks) {
            if (!this._loadTasks(tasks)) {
                throw new Error('Failed to load tasks');
            }
        }
        
        return this;
    },

    _loadModule: function(name) {
        if (require) {
            try {
                return this._loadTasks(require(name));
            } catch (err) {}
        }

        return this._loadDir(path.resolve('node_modules', name, 'lib'));
    },

    _loadDir: function(dirname) {
        if (!existsSync(dirname)) {return false;}
        
        var fs = require('fs'),
            files = fs.readdirSync(dirname),
            self = this;

        files.forEach(function(filename) {
            var name = path.join(dirname, filename);
            if (path.extname(name) !== '.js') {return;}
            self._loadFile(name);
        });

        return true;
    },

    _loadFile: function(filename) {
        if (!existsSync(filename)) {return false;}

        return this._loadTasks(require(filename));
    },

    _loadTasks: function(tasks) {
        var name;

        for (name in tasks) {
            this._tasks[name] = tasks[name];
        }

        return true;
    },

    task: function(name) {
        if (!(name in this._tasks)) {
            throw new Error('Task ' + name + ' doesn\'t exist');
        }

        return this._tasks[name];
    }
};
