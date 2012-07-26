/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*
 * Blob
 *
 * Loosely based on W3C Blob:
 * http://www.w3.org/TR/FileAPI/#dfn-Blob
 * https://developer.mozilla.org/en/DOM/Blob
 *
 * @param parts {Buffer|String|Blob|Array} Create new Blob from String/Blob or Array of String/Blob.
 */
var Blob = exports.Blob = function Blob(parts, properties) {
    parts = typeof parts === 'undefined' ? [] : Array.prototype.concat(parts);
    properties = properties || {};

    var result = parts.length ? parts.shift() : '',
        props = {},
        self = this;

    function getProps(part) {
        if (part instanceof Blob) {
            Object.keys(part).forEach(function(attr) {
                props[attr] = part[attr];
            });
        }
    }

    getProps(result);
    if (result instanceof Blob) {
        result = result.result;
    }

    parts.forEach(function(part) {
        result += part instanceof Blob ? part.result : part;
        getProps(part);
    });

    Object.keys(properties).forEach(function(attr) {
        props[attr] = properties[attr];
    });

    Object.keys(props).forEach(function(attr) {
        if (attr !== 'result') {
            Object.defineProperty(self, attr, {enumerable: true, value: props[attr]});
        }
    });

    Object.defineProperty(this, 'result', {value: result});
};

Blob.prototype.toString = function() {
    return this.result;
};

var readFile = {
    server: function(name, encoding, callback, sync) {
        var fs = require('fs');

        if (sync) {
            readFile.serverSync(name, encoding, callback);
        } else {
            fs.readFile(name, encoding === 'bin' ? undefined : encoding, function(err, data) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, new Blob(data, {name: name}));
                }
            });
        }
    },

    // readFileSync added due to some strange async behavior with readFile
    serverSync: function(name, encoding, callback) {
        var fs = require('fs'),
            data;

        try {
            data = fs.readFileSync(name, encoding === 'bin' ? undefined : encoding);
            callback(null, new Blob(data, {name: name}));
        } catch(e) {
            callback(e);
        }
    },

    client: function(name, encoding, callback) {
        if (name in localStorage) {
            callback(null, new Blob(localStorage[name], {name: name}));
        } else {
            callback('localStorage has no item ' + name);
        }
    }
};

Blob.readFile = Blob.prototype.readFile = (typeof module === 'undefined') ? readFile.client : readFile.server;

var writeFile = {
    server: function(name, blob, encoding, callback) {
        var fs = require('fs'),
            path = require('path'),
            mkdirp = require('mkdirp').mkdirp,
            Crypto = require('crypto');
        
        function writeFile(filename, b) {
            fs.writeFile(filename, b.result, encoding === 'bin' ? undefined : encoding, function(err) {
                callback(err, new Blob(b, {name: filename}));
            });
        }

        var dirname = path.resolve(path.dirname(name)),
            checksum;

        if (name.indexOf('{checksum}') > -1) {  // Replace {checksum} with md5 string
            checksum = Crypto.createHash('md5');
            checksum.update(blob.result);
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
        localStorage[name] = blob.result;
        callback(null, new blob.constructor(blob, {name: name}));
    }
};

Blob.writeFile = Blob.prototype.writeFile = (typeof module === 'undefined') ? writeFile.client : writeFile.server;