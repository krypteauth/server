var path = require('path');

var require_old = require;

var require = function (module) {
    return require_old(path.join(__dirname, module));
};

var index = function (req, res) {

	res.send("Hello world")
}

module.exports = exports = {
    index: {get:index},
    auth: require('auth')
};