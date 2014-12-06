var path = require('path');

var require_old = require;

var require = function (module) {
    return require_old(path.join(__dirname, module));
};

module.exports = {
    Token: require('token'),
    Credential: require('credential')
};