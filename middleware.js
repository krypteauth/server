var sha1 = require('sha1')
var keys = require('./config/security').keys

var sign = function(s, t) {

	return sha1(s+' '+t)
}

var sessionRequired = function (req, res, next){

	var session = req.session

	if (session.auth) {
		next()
	} else {
		res.redirect('/login?redirect='+req.originalUrl)
	}
}

var json = function (req, res, next) {

	res.set('Content-type', 'application/json')
	next()
}

var isApi = function (req, res, next) {

	req.isApi = req.get('X-IsApi')
	if (req.isApi) {
		json(req, res, next)
	} else {
		next()
	}
	
}

var middleware = {

	sessionRequired: sessionRequired,
	isApi: isApi
}

module.exports = exports = middleware