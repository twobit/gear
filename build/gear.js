/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    if (require) {
        var path = require('path'),
            fs = require('fs');
    }
    
    /*
     * Registry - Container for available tasks.
     */
    var Registry = exports.Registry = function Registry(options) {
        var self = this;
        this._tasks = {};

        if (options) {
            this.load(options);
        }

        Object.defineProperty(this, 'tasks', {get: function() {
            return Object.keys(self._tasks);
        }});
    };

    Registry.prototype = {
        /*
         * Load tasks from NPM, directory, or file.
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
        },

        _loadModule: function(name) {
            this._loadDir(path.resolve('node_modules', name, 'lib'));
        },

        _loadDir: function(dirname) {
            var files = fs.readdirSync(dirname),
                self = this;

            if (!path.existsSync(dirname)) {
                throw new Error('Directory ' + dirname + ' doesn\'t exist');
            }

            files.forEach(function(filename) {
                self._loadFile(path.join(dirname, filename));
            });
        },

        _loadFile: function(filename) {
            if (path.extname(filename) !== '.js') {
                return;
            }

            if (!path.existsSync(filename)) {
                throw new Error('File ' + filename + ' doesn\'t exist');
            }

            var name,
                file = require(filename);

            for (name in file) {
                this._tasks[name] = file[name];
            }
        },

        task: function(name) {
            return this._tasks[name];
        }
    };
})(typeof exports === 'undefined' ? this['gear_core'] = {} : exports);/*
 * Blob
 *
 * Loosely based on W3C Blob:
 * http://www.w3.org/TR/FileAPI/#dfn-Blob
 * https://developer.mozilla.org/en/DOM/Blob
 *
 * @param parts {String|Blob|Array} Create new Blob from String/Blob or Array of String/Blob.
 */
(function(exports) {
    var Blob = exports.Blob = function Blob(parts, properties) {
        if (parts === undefined) {
            parts = [];
        } else {
            if (!Array.isArray(parts)) {
                parts = [parts];
            }
        }

        properties = properties || {};

        var content = '',
            props = {};

        parts.forEach(function(part) {
            content += part;

            var attr;
            if (typeof part === 'object') {
                for (attr in part) {
                    props[attr] = part[attr];
                }
            }
        });

        var attr;
        for (attr in properties) {
            props[attr] = properties[attr];
        }

        Object.defineProperty(this, '_content', {get: function() {
            return content;
        }});

        Object.defineProperty(this, 'properties', {get: function() {
            return props;
        }});
    };

    Blob.prototype.create = function(parts, properties) {
        return new Blob(parts, properties);
    };

    Blob.prototype.toString = function() {
        return this._content;
    };
})(typeof exports === 'undefined' ? this['gear_core'] = {} : exports);/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    if (require) {
        var async = require('async'),
            Registry = require('./registry').Registry,
            Blob = require('./blob').Blob;
    }
    
    /*
     * Queue
     */
    var Queue = exports.Queue = function Queue(options) {
        var self = this;
        options = options || {};
        this._registry = options.registry || new Registry();
        this._queue = [
            function(callback) {
                callback(null, []);
            }
        ];

        // Add registry tasks
        this._registry.tasks.forEach(function(name) {
            self[name] = self.task.bind(self, name);
        });
    };

    Queue.prototype._log = function(message) {
        console.log(message);
    };

    Queue.prototype._dispatch = function(name, options, blobs, done) {
        var task = this._registry.task(name);

        // Task type determines how blobs are processed
        switch (task.type) {
            case 'append': // Add blobs to queue
                if (options === undefined) {
                    options = [];
                } else {
                    if (!Array.isArray(options)) {
                        options = [options];
                    }
                }

                async.map(options, task.bind(this), function(err, results) {
                    done(err, blobs.concat(results));
                });
                break;

            case 'iterate': // Task can look at all blobs at once
                task.call(this, options, blobs, done);
                break;

            case 'reduce': // Reduce blobs operating on a per task basis
                async.reduce(blobs, new Blob(), task.bind(this, options), function(err, results) {
                    done(err, [results]);
                });
                break;

            case 'slice': // Select up to options.length blobs
                async.map(blobs.slice(0, Array.isArray(options) ? options.length : 1), task.bind(this, options), done);
                break;

            default: // Transform blob on a per task basis
                async.map(blobs, task.bind(this, options), done);
                break;
        }
    };

    Queue.prototype.task = function(name, options) {
        this._queue.push(this._dispatch.bind(this, name, options));
        return this;
    };

    Queue.prototype.run = function(callback) {
        async.waterfall(this._queue, callback);
    };
})(typeof exports === 'undefined' ? this['gear_core'] = {} : exports);/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    /**
     * Concatenates blobs.
     *
     * @param options {Object} Concat options.
     * @param options.callback {Function} Callback on each blob.
     * @param blobs {Array} Incoming blobs.
     * @param done {Function} Callback on task completion.
     */
    var concat = exports.concat = function concat(options, prev, blob, done) {
        options = options || {};
        done(null, blob.create([prev, options.callback ? options.callback(blob) : blob]));
    };
    concat.type = 'reduce';
    concat.browser = true;
})(typeof exports === 'undefined' ? this['gear_tasks'] = {} : exports);/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    /**
     * Gets a blob.
     *
     * @param index {Integer} Index of blobs.
     * @param blobs {Array} Incoming blobs.
     * @param done {Function} Callback on task completion.
     */
    var get = exports.get = function get(index, blobs, done) {
        done(null, blobs.slice(index, index + 1));
    };
    get.type = 'iterate';
    get.browser = true;

    /**
     * Log a string.
     *
     * @param string {String} String to log.
     * @param blob {Array} Incoming blobs.
     * @param done {Function} Callback on task completion.
     */
    var log = exports.log = function log(string, blobs, done) {
        this._log(string);
        done(null, blobs);
    };
    log.type = 'iterate';
    log.browser = true;

    /**
     * Inspects blobs.
     *
     * @param options {Object} Ignored.
     * @param blob {Object} Incoming blobs.
     * @param done {Function} Callback on task completion.
     */
    var inspect = exports.inspect = function inspect(options, blobs, done) {
        var self = this;
        this._log('INSPECT: ' + blobs.length + (blobs.length > 1 ? ' blobs' : ' blob'));

        blobs.forEach(function(blob, index) {
            self._log(blob.toString());
        });

        done(null, blobs);
    };
    inspect.type = 'iterate';
    inspect.browser = true;
})(typeof exports === 'undefined' ? this['gear_tasks'] = {} : exports);/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    if (require) {
        var fs = require('fs'),
            Blob = require('../blob').Blob;
    }

    /**
     * Loads blobs from different sources.
     * TODO: Add more sources i.e. (url).
     *
     * @param options {Object} File options or filename.
     * @param options.file {Object} Filename to load.
     * @param done {Function} Callback on task completion.
     */
    var load = exports.load = function load(options, done) {
        options = (typeof options === 'string') ? {file: options} : options;

        if (options.file) {
            fs.readFile(options.file, function(err, data) {
                done(err, new Blob(data, {name: options.file}));
            });
        }
    };
    load.type = 'append';
})(typeof exports === 'undefined' ? this['gear_tasks'] = {} : exports);/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    if (require) {
        var async = require('async');
    }

    /**
     * Advanced flow execution.
     *
     * @param workflow {String} TODO.
     * @param blob {Object} Incoming blob.
     * @param done {Function} Callback on task completion.
     */
    var tasks = exports.tasks = function tasks(workflow, blobs, done) {
        var item,
            requires,
            fn,
            auto = {},
            self = this;

        function task(name, options, requires) {
            return function(callback, result) {
                var new_blobs = requires.length ? [] : blobs;
                result = result || [];

                // Concat dependency blobs in order of requires array
                requires.forEach(function(item) {
                    new_blobs = new_blobs.concat(result[item]);
                });

                self._dispatch(name, options, new_blobs, callback);
            };
        }

        for (item in workflow) {
            requires = workflow[item].requires;
            fn = task(workflow[item].task, workflow[item].options, requires || []);
            auto[item] = requires ? requires.concat(fn) : fn;
        }
        
        async.auto(auto, done);
    };
    tasks.type = 'iterate';
})(typeof exports === 'undefined' ? this['gear_tasks'] = {} : exports);/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    if (require) {
        var fs = require('fs'),
            path = require('path'),
            mkdirp = require('mkdirp').mkdirp,
            Crypto = require('crypto');
    }
    
    /**
     * Write the blob to disk with an optional checksum in the filename.
     *
     * @param options {Object} Write options or filename.
     * @param options.file {String} Filename to write.
     * @param blob {Object} Incoming blob.
     * @param done {Function} Callback on task completion.
     */
    var write = exports.write = function write(options, blob, done) {
        options = (typeof options === 'string') ? {file: options} : options;

        var dirname = path.resolve(path.dirname(options.file)),
            checksum;

        function writeFile(name, b) {
            fs.writeFile(name, blob.toString(), function(err) {
                done(err, blob.create(blob, {name: name}));
            });
        }

        if (options.file.indexOf('{checksum}') > -1) {  // Replace {checksum} with md5 string
            checksum = Crypto.createHash('md5');
            checksum.update(blob.toString());
            options.file = options.file.replace('{checksum}', checksum.digest('hex'));
        }

        path.exists(dirname, function(exists) {
            if (!exists) {
                mkdirp(dirname, '0755', function(err) {
                    if (err) {
                        done(err);
                    } else {
                        writeFile(options.file, blob);
                    }
                });
            }
            else {
                writeFile(options.file, blob);
            }
        });
    };
    write.type = 'slice';
})(typeof exports === 'undefined' ? this['gear_tasks'] = {} : exports);