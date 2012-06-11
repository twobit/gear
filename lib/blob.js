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
})(typeof exports === 'undefined' ? this.gear : exports);