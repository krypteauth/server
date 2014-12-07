var tfa = require('speakeasy'),
	async = require('async')

var Credential = require('mongoose').model('Credential')

var getLogin = function (req, res){

	var redirect = req.query['redirect']

	if (!req.session.auth) {
		res.render('login', {error:req.query['error']})
	} else {
		if (req.isApi) {
			res.sendStatus(200)
		} else if (redirect) {
			res.redirect(redirect)
		} else {
			res.redirect('/config')
		}
	}
}

var postLogin = function (req, res){

	var code = req.body['code'],
		redirect = req.query['redirect']

	if (!code) {
		res.status(500).send('Inexistent code')
	} else {

		Credential.find({kind:'tfa'}, function (err, cs){

			if (err || !cs) {
				res.sendStatus(500)
			} else {

				async.filter(cs, function (c, cb) {

					cb(code == tfa.time({key:c.key, encoding: 'base32'}))

				}, function (css) {

					if (css.length < 1) {
						if (req.isApi) {
							res.sendStatus(403)
						} else {
							res.redirect(req.originalUrl+'?error=Auth%20failed')
						}
					} else {

						//SET HEADER
						req.session.auth = true

						if (req.isApi) {
							res.sendStatus(200)
						} else if (redirect) {
							res.redirect(redirect)
						} else {
							res.redirect('/config')
						}
					}
				})
			}
		})
	}
}

var logout = function (req, res){
	req.session.auth = false
	res.sendStatus(200)
}

module.exports = {
	get: getLogin,
	post: postLogin,
	logout: logout
}