exports.inspect = function(params, objects, logger, callback) {
    objects.forEach(function(object) {
        logger.log(object);
    });

    callback(null, objects);
};