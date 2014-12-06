var async = require('async'),
	sha1 = require('sha1')

var Token = require('mongoose').model('Token'),
	Info = require('mongoose').model('Info')

var getAuth = function(req, res) {

	var permissions = JSON.parse(req.query['permissions'] || "[\"name\"]"),
		provider = req.query['provider'],
		callback = req.query['callback']

	if (!provider || !callback) {

		res.status(500).send("Bad formed request. Lacking provider or callback")
	} else {

		Info.find({key:{$in:permissions}}, function (err, infos) {
			if (err) {
				res.send(500)
			} else {
				Token.findOne({provider: provider}, function (err, token) {

					var already = false

					if (token) {
						already = true
					} 
					// [["name", "Jorge Izquierdo", 0], ["email", "izqui97@gmail.com", 1]]

					async.reduce(permissions, [], function (vs, p, cb){

						var found = 0
						
						if (token) {

							var perms = token.permissions.toObject()

							for (var i in perms) {

								if (perms[i] == p) {
									found = 1
									break
								}
							}
						} 
						//TODO: If no info for field, option to enter it [Issue: https://github.com/authyhack/server/issues/3]
						var value = null
						for (var i in infos) {
							if (infos[i].key == p) {
								value = infos[i].value
							}
						}
						if (value) vs.push([p, value, found])
						cb(null, vs)

					}, function(err, permissions){

						console.log(permissions)
						if (err) {
							res.sendStatus(500)
						} else {

							res.render('auth', {provider: provider, permissions: permissions, alreadyAuthorized: already, callback: callback})
						}
					})
				})
			}
		})
	}
}

var postAuth = function(req, res) {

	var provider = req.body['provider'],
		callback = req.body['callback']

	if (!provider || !callback) {

		res.status(500).send("Bad formed request. Lacking provider or callback")
	} else {
		var permissions = []
		for (var k in req.body) {
			// Permissions format "p.name"
			if (k.indexOf('p.') == 0 && req.body[k] != null) permissions.push(k.slice(2, k.length))
		}
		
		Token.findOne({provider: provider}, function (err, token) {

			if (err || !token) {
				//TODO: Token expiry thingy [Issue: https://github.com/authyhack/server/issues/2]
				token = new Token({provider: provider, token: generateToken(provider)})
			}

			token.permissions = permissions
			token.save(function (err){
				if (err) {
					res.status(500).send('I don\'t know what happened. i was tired')
				} else if (req.isApi) {
					res.send(200)
				} else {
					res.redirect(callback+'?token='+token.token)
				}
			})
		})
	}		
}

var generateToken = function (prov){

	return sha1(prov+new Date().getTime())
}

var auth = {
	get: getAuth,
	post: postAuth
}

module.exports = exports = auth
