/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(function(exports) {
     /*
     * Blob
     *
     * Loosely based on W3C Blob:
     * http://www.w3.org/TR/FileAPI/#dfn-Blob
     * https://developer.mozilla.org/en/DOM/Blob
     *
     * @param parts {String|Blob|Array} Create new Blob from String/Blob or Array of String/Blob.
     */
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

    Blob.prototype.toString = function() {
        return this._content;
    };

    var readFile = {
        server: function(name, encoding, callback) {
            var fs = require('fs');
            fs.readFile(name, encoding, function(err, data) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, new Blob(data, {name: name}));
                }
            });
        },
        client: function(name, encoding, callback) {
            if (name in localStorage) {
                callback(null, new Blob(localStorage[name], {name: name}));
            } else {
                callback('localStorage has no item ' + name);
            }
        }
    };

    Blob.readFile = Blob.prototype.readFile = (typeof require === 'undefined') ? readFile.client : readFile.server;

    var writeFile = {
        server: function(name, blob, encoding, callback) {
            var fs = require('fs'),
                path = require('path'),
                mkdirp = require('mkdirp').mkdirp,
                Crypto = require('crypto');
            
            function writeFile(filename, b) {
                fs.writeFile(filename, b.toString(), function(err) {
                    callback(err, new Blob(b, {name: filename}));
                });
            }

            var dirname = path.resolve(path.dirname(name)),
                checksum;

            if (name.indexOf('{checksum}') > -1) {  // Replace {checksum} with md5 string
                checksum = Crypto.createHash('md5');
                checksum.update(blob.toString());
                name = name.replace('{checksum}', checksum.digest('hex'));
            }

            path.exists(dirname, function(exists) {
                if (!exists) {
                    mkdirp(dirname, '0755', function(err) {
                        if (err) {
                            callback(err);
                        } else {
                            writeFile(name, blob);
                        }
                    });
                }
                else {
                    writeFile(name, blob);
                }
            });
        },
        client: function(name, blob, encoding, callback) {
            localStorage[name] = blob.toString();
            callback(null, new blob.constructor(blob, {name: name}));
        }
    };

    Blob.writeFile = Blob.prototype.writeFile = (typeof require === 'undefined') ? writeFile.client : writeFile.server;
})(typeof exports === 'undefined' ? this.gear : exports);