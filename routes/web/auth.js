
var getAuth = function(req, res) {

	var permissions = JSON.parse(req.query.permissions || "[\"name\"]")

	res.render('auth', {provider: 'Twitter', permissions: permissions})
}

var postAuth = function(req, res) {


}

var auth = {
	get: getAuth,
	post: postAuth
}

module.exports = exports = auth