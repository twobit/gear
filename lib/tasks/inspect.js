module.exports = function(done) {
    this._data.forEach(function(item) {
        console.log(item);
    });

    done(null, 'inspect');
};