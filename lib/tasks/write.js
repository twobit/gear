var fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp').mkdirp,
    Crypto = require('crypto');

/**
 * Write the message to disk with an optional checksum in the filename.
 *
 * @param options {Object} Write task options.
 * @param options.file {String} Filename to write.
 * @param message {Object} Incoming message.
 * @param done {Function} Callback on task completion.
 */
exports.write = {
    fn: function(options, message, done) {
        var name = options.file,
            dirname = path.resolve(path.dirname(options.file)),
            checksum;

        function writeFile(name, message) {
            fs.writeFile(name, message.body, function(err) {
                done(err, {
                    meta: {
                        name: name
                    },
                    body: message.body
                });
            });
        }

        if (name.indexOf('{checksum}') > -1) {  // Replace {checksum} with md5 string
            checksum = Crypto.createHash('md5');
            checksum.update(message.body);
            name = name.replace('{checksum}', checksum.digest('hex'));
        }

        path.exists(dirname, function(exists) {
            if (!exists) {
                mkdirp(dirname, '0755', function(err) {
                    if (err) {
                        done(err);
                    } else {
                        writeFile(name, message);
                    }
                });
            }
            else {
                writeFile(name, message);
            }
        });
    }
};