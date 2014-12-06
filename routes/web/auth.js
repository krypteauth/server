var async = require('async')
var Token = require('mongoose').model('Token')

var getAuth = function(req, res) {

	var permissions = JSON.parse(req.query.permissions || "[\"name\"]"),
		provider = req.query.provider

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

			vs.push([p, found])
			cb(null, vs)
			
		}, function(err, permissions){
			if (err) {
				res.sendStatus(500)
			} else {

				res.render('auth', {provider: 'Twitter', permissions: permissions, alreadyAuthorized: already})
			}
		})
	})
}

var postAuth = function(req, res) {

	var accepted = req.body.accepted

}

var auth = {
	get: getAuth,
	post: postAuth
}

module.exports = exports = auth