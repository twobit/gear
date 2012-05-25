var fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp').mkdirp,
    Crypto = require('crypto');

/**
 * Write the message to disk with an optional checksum in the filename.
 *
 * @param options {Object} Write options or filename.
 * @param options.file {String} Filename to write.
 * @param message {Object} Incoming message.
 * @param done {Function} Callback on task completion.
 */
var write = exports.write = function write(options, message, done) {
    options = (typeof options === 'string') ? {file: options} : options;

    var dirname = path.resolve(path.dirname(options.file)),
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

    if (options.file.indexOf('{checksum}') > -1) {  // Replace {checksum} with md5 string
        checksum = Crypto.createHash('md5');
        checksum.update(message.body);
        options.file = options.file.replace('{checksum}', checksum.digest('hex'));
    }

    path.exists(dirname, function(exists) {
        if (!exists) {
            mkdirp(dirname, '0755', function(err) {
                if (err) {
                    done(err);
                } else {
                    writeFile(options.file, message);
                }
            });
        }
        else {
            writeFile(options.file, message);
        }
    });
};
write.type = 'slice';