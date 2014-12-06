var tfa = require('speakeasy')

var Credential = require('mongoose').model('Credential')

var getLogin = function (req, res){
	res.render('login', {error:req.query.error})
}

var postLogin = function (req, res){

	var code = req.body.code,
		redirect = req.body.redirect
	
	Credential.findOne({kind:'tfa'}, function (err, c){

		if (err || !c) {
			res.sendStatus(500)
		} else {

			if (code != tfa.time({key:c.key, encoding: 'base32'})) {

				res.redirect('/login?error=Auth%20failed')
			} else {

				if (redirect) {
					res.redirect(redirect)
				} else {
					res.redirect('/config?qr')
				}
			}
		}
	})
}
module.exports = {
	get: getLogin,
	post: postLogin
}