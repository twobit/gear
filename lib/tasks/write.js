var fs = require('fs');

exports.write = function(params, objects, logger, callback) {
    var filename = params.filename;

    function writeFile(filename, content) {
        fs.writeFile(filename, content, function(err) {
            callback(err, objects);
        });
    }

    if (objects.length) {
        writeFile(filename, objects[objects.length - 1].content);
    }
    else {
        callback(null, objects);
    }
};