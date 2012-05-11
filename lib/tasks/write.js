var fs = require('fs');

exports.write = function(options, data, callback) {
    var filename = options.filename,
        i,
        result;

    function writeFile(filename, content) {
        fs.writeFile(filename, content, function(err) {
            callback(err, data);
        });
    }

    for (i = data.length - 1; i >= 0; i--) {
        if (data[i].status === 200) {
            result = data[i];
            break;
        }
    }

    if (result) {
        writeFile(filename, result.content);
    }
    else {
        callback(null, data);
    }
};