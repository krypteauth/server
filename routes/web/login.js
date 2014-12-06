var tfa = require('speakeasy'),
	async = require('async')

var Credential = require('mongoose').model('Credential')

var getLogin = function (req, res){

	var redirect = req.query.redirect

	if (!req.session.auth) {
		res.render('login', {error:req.query.error})
	} else {
		if (redirect) {
			res.redirect(redirect)
		} else {
			res.redirect('/config')
		}
	}
}

var postLogin = function (req, res){

	var code = req.body.code,
		redirect = req.query.redirect
	
	Credential.find({kind:'tfa'}, function (err, cs){

		if (err || !cs) {
			res.sendStatus(500)
		} else {

			async.filter(cs, function (c, cb) {
				console.log(code)
				console.log(tfa.time({key:c.key, encoding: 'base32'}))
				cb(code == tfa.time({key:c.key, encoding: 'base32'}))

			}, function (css) {

				if (css.length < 1) {
					res.redirect(req.originalUrl+'?error=Auth%20failed')
				} else {

					req.session.auth = true
					if (redirect) {
						res.redirect(redirect)
					} else {
						res.redirect('/config')
					}
				}
			})
		}
	})
}

module.exports = {
	get: getLogin,
	post: postLogin
}