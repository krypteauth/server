var Token = require('mongoose').model('Token')

var getProviders = function(req, res) {

	Token.find({}, function (err, tokens) {

		if (err) {
			res.sendStatus(500)
		} else {

			var providers = []
			tokens.forEach(function (t){
				providers.push(t.provider)
			})

			if (req.isApi) {
				res.send({providers:providers})
			} else {
				res.render('providers', {providers:providers})
			}
		}
	})
}

var prov = {
	get: getProviders
}

module.exports = exports = prov