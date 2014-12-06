
var getAuth = function(req, res) {

	res.render('auth', {provider: 'Twitter'})
}

var postAuth = function(req, res) {

}

var auth = {
	get: getAuth,
	post: postAuth
}

module.export = exports = auth