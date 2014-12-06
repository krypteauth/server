var tfa = require('speakeasy')
var middleware = require('../../middleware')

var Credential = require('mongoose').model('Credential')

var getConf = function (req, res){
	res.render('config', {error:req.query.error})
}

var postConf = function (req, res){

	var form = req.body

	for (var k in form) {
		var value = form[k]
		console.log(k+value)
	}
}

var getQR = function (req, res){

	Credential.count(function (err, c){
		if (err || (c != 0 && !req.session.auth)) {
			res.sendStatus(403)
		} else {
			var key = tfa.generate_key({length: 20, google_auth_qr: true})
			res.render('qr', {qrURL:key.google_auth_qr, key: key.base32, error: req.query.error})
		}
	})
}

var postQR = function (req, res){

	var key = req.body.key,
		code = req.body.code

	Credential.count(function (err, c){ 

		if (c != 0 && !req.session.auth) {

			//If already has one credential, has to be authenticated to create another one
			res.sendStatus(403)

		} else if (key && code && code == tfa.time({key:key, encoding: 'base32'})) {
			new Credential({key:key, kind:'tfa'}).save(function (err){
				if (err) {
					res.sendStatus(500)
				} else {

					//SET HEADER
					req.session.auth = true
					res.redirect('/config?qr')
				}
			})
		} else {
			res.redirect('/config/qr?error=Auth%20failed')
		}
	})
}

module.exports = {
	get: getConf,
	post: postConf,
	qr: {
		get: getQR,
		post: postQR
	}
}