/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

if (process.env.GEAR_COV) {
    exports.Registry = require('./lib-cov/registry').Registry;
    exports.Queue = require('./lib-cov/queue').Queue;
    exports.Blob = require('./lib-cov/blob').Blob;
} else {
    exports.Registry = require('./lib/registry').Registry;
    exports.Queue = require('./lib/queue').Queue;
    exports.Blob = require('./lib/blob').Blob;
}