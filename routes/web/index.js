var path = require('path');

var require_old = require;

var require = function (module) {
    return require_old(path.join(__dirname, module));
};

module.exports = exports = {
    root: require('root'),
    auth: require('auth'),
    login: require('login'),
    config: require('config')
}