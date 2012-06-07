/*
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