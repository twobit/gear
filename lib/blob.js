/*
 * Blob
 *
 * Loosely based on W3C Blob:
 * http://www.w3.org/TR/FileAPI/#dfn-Blob
 * https://developer.mozilla.org/en/DOM/Blob
 *
 * @param parts {Array} Create new Blob from array consisting of Strings/Blobs.
 */
var Blob = exports.Blob = function Blob(parts, properties) {
    parts = parts || [];
    properties = properties || {};

    this._content = '';
    this._properties = {};

    var self = this;
    parts.forEach(function(part) {
        self._content += part;

        var attr;
        if (typeof part === 'object') {
            for (attr in part) {
                self._properties[attr] = part[attr];
            }
        }
    });

    var attr;
    for (attr in properties) {
        this._properties[attr] = properties[attr];
    }

    Object.defineProperty(this, 'properties', {get: function() {
        return self._properties;
    }});
};

Blob.prototype.create = function(parts, properties) {
    return new Blob(parts, properties);
};

Blob.prototype.toString = function() {
    return this._content;
};