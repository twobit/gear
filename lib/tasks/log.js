exports.log = function(params, objects, logger, callback) {
    logger.log(params);

    callback(null, objects);
};