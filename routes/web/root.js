var Credential = require('mongoose').model('Credential')

var getRoot = function (req, res){

	Credential.count(function (err, c){
		if (err || c != 0) {
			res.redirect('/login')
		} else {
			res.redirect('/config/qr')
		}
	})
}

module.exports = {
	get: getRoot
}