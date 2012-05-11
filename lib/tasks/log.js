exports.log = function(params, objects, logger, callback) {
    console.log(params);

    callback(null, objects);
};