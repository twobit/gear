/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
    if (typeof require !== 'undefined') {
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
        options = (typeof options === 'string') ? {name: options} : options;

        var dirname = path.resolve(path.dirname(options.name)),
            checksum;

        function writeFile(name, b) {
            fs.writeFile(name, blob.toString(), function(err) {
                done(err, new blob.constructor(blob, {name: name}));
            });
        }

        if (options.name.indexOf('{checksum}') > -1) {  // Replace {checksum} with md5 string
            checksum = Crypto.createHash('md5');
            checksum.update(blob.toString());
            options.name = options.name.replace('{checksum}', checksum.digest('hex'));
        }

        path.exists(dirname, function(exists) {
            if (!exists) {
                mkdirp(dirname, '0755', function(err) {
                    if (err) {
                        done(err);
                    } else {
                        writeFile(options.name, blob);
                    }
                });
            }
            else {
                writeFile(options.name, blob);
            }
        });
    };
    write.type = 'slice';
})(typeof exports === 'undefined' ? this.tasks || (this.tasks = {}) : exports);