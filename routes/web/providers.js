
var getProviders = function(req, res) {

	if (req.isApi) {
		res.send(200, {so:'json'})
	} else {
		res.send('ola')
	}
}

var prov = {
	get: getProviders
}

module.exports = exports = prov