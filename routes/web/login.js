var tfa = require('speakeasy'),
	async = require('async')

var Credential = require('mongoose').model('Credential')

var getLogin = function (req, res){
	res.render('login', {error:req.query.error})
}

var postLogin = function (req, res){

	var code = req.body.code,
		redirect = req.body.redirect
	
	//TODO: Find more that one
	Credential.find({kind:'tfa'}, function (err, cs){

		if (err || !c) {
			res.sendStatus(500)
		} else {

			async.filter(cs, function (c, cb) {

				cb(tfa.time({key:c.key, encoding: 'base32'}))
			}, function (css) {
				
				if (css.length < 1) {
					res.redirect(res.originalUrl+'?error=Auth%20failed')
				} else {
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