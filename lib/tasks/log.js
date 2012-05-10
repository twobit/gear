exports.log = function(options, data, callback) {
    console.log(options);

    callback(null, data);
};