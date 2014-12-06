var sha1 = require('sha1')
//var User = require('mongoose').model('User')
var keys = require('./config/security').keys

var sign = function(s, t) {

	return sha1(s+' '+t)
}

/*var checkSignature = function (req, res, next){
	
	var s = req.get('X-Api-Signature'),
		t = parseInt(req.get('X-Api-Timestamp')),
		key = req.get('X-Api-Key'),
		secret = keys[key]

	if (!s || !t || parseInt(new Date().getTime()/1000) - 10 > t || !secret || sign(secret, t) != s){
		res.send(403, {})
	} else {
		next()
	}
}

var getToken = function(ts, t) {

	for (var tt in ts) {
		if (ts[tt].token == t) return ts[tt]
	}
	return null
}
var checkToken = function (req, res, next) {

	var t = req.get('X-Api-Token')

	User.findOne({"tokens.token": t}).populate("preferences.category").exec(function (err, user) {
		if (err || !user) {
			console.log(err)
			res.send(403, {})
		} else if (parseInt(new Date().getTime()/1000) > getToken(user.tokens, t).expires) {
			res.send(440, {})
		} else {
			req.user = user
			next()
		}
	})
}
*/

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

var middleware = {

	//signatureRequired: checkSignature, 
	//tokenRequired: checkToken,
	sessionRequired: sessionRequired,
	jsonResponse: json
}

module.exports = exports = middleware