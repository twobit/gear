exports.log = function(options, data, callback) {
    console.log(options[0]);

    callback(null, data);
};