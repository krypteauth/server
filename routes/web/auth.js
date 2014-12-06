var async = require('async')
var Token = require('mongoose').model('Token')

var getAuth = function(req, res) {

	var permissions = JSON.parse(req.query.permissions || "[\"name\"]"),
		provider = req.query.provider,
		callback = req.query.callback

	if (!provider || !callback) {

		res.status(500).send("Bad formed request. Lacking provider or callback")
	} else {

		Token.findOne({provider: provider}, function (err, token) {

			var already = false

			if (token) {
				already = true
			} 
			// [["name", 0], ["email", 1]]
			async.reduce(permissions, [], function (vs, p, cb){

				var found = 0
				if (token) {

					token.permissions.forEach(function (pi){
						found = (pi == p)
					})
				} 
				//TODO: Not push data not existent in database [Issue: https://github.com/authyhack/server/issues/1]
				vs.push([p, found])
				cb(null, vs)

			}, function(err, permissions){
				if (err) {
					res.sendStatus(500)
				} else {

					res.render('auth', {provider: provider, permissions: permissions, alreadyAuthorized: already, callback: callback})
				}
			})
		})
	}
}

var postAuth = function(req, res) {

	var provider = req.body.provider,
		callback = req.body.callback
		
}

var auth = {
	get: getAuth,
	post: postAuth
}

module.exports = exports = auth
