/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp').mkdirp,
    Crypto = require('crypto');

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

    function writeFile(name, blob) {
        fs.writeFile(name, blob.body, function(err) {
            done(err, {
                meta: {
                    name: name
                },
                body: blob.body
            });
        });
    }

    if (options.file.indexOf('{checksum}') > -1) {  // Replace {checksum} with md5 string
        checksum = Crypto.createHash('md5');
        checksum.update(blob.body);
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