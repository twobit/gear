module.exports = function(options, data, done) {
    data.forEach(function(item) {
        console.log(item);
    });

    done(null, data);
};