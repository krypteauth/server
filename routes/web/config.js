var tfa = require('speakeasy')

var Credential = require('mongoose').model('Credential')

var getConf = function (req, res){
	res.send('configurate you idiot')
}

var getQR = function (req, res){

	Credential.count(function (err, c){
		if (err || c != 0) {
			res.sendStatus(404)
		} else {
			var key = tfa.generate_key({length: 20, google_auth_qr: true})
			console.log()
			res.render('qr', {qrURL:key.google_auth_qr, key: key.base32, error: req.query.error})
		}
	})
}

var postQR = function (req, res){

	var key = req.body.key,
		code = req.body.code

	Credential.count(function (err, c){ 

		if (c != 0) {

			//Has to be authenticated
		}

		if (key && code && code == tfa.time({key:key, encoding: 'base32'})) {
			new Credential({key:key, kind:'tfa'}).save(function (err){
				if (err) {
					res.sendStatus(500)
				} else {
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
	qr: {
		get: getQR,
		post: postQR
	}
}