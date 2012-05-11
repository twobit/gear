exports.concat = function(params, objects, logger, callback) {
    var result = {
        meta: {},
        content: ''
    };

    objects.forEach(function(object) {
        result.content += object.content;
    });

    callback(null, [result]);
};