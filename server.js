var express = require('express'),
	bodyParser = require('body-parser'),
	logger = require('morgan')

var routes = require('./routes'),
	middleware = require('./middleware')

exports = module.exports = function() {

	var app = express()

	app.set('x-powered-by', false);
	app.use(logger('combined'))
	app.set('view engine', 'ejs')
	app.use(bodyParser.urlencoded({ extended: false }))

	app.route('/')
		.get(routes.web.root.get)

	app.route('/login')
		.get(routes.web.login.get)
		.post(routes.web.login.post)

	app.route('/config')
		.get(routes.web.config.get)
	app.route('/config/qr')
		.get(routes.web.config.qr.get)
		.post(routes.web.config.qr.post)

	app.route('/auth')
		.get(routes.web.auth.get)
		.post(routes.web.auth.post)

	//app.use('/api/*', bodyParser.json(), middleware.jsonResponse)
	//app.use('/api/*', middleware.signatureRequired)

	/*app.route('/api/auth')
		.post(routes.api.auth.post)
		.delete(middleware.tokenRequired, routes.api.auth.delete)

	app.route('/api/categories')
		.all(middleware.tokenRequired)
		.get(routes.api.categories.get)
		.post(routes.api.categories.post)

	app.route('/api/articles')
		.all(middleware.tokenRequired)
		.get(routes.api.articles.get)

	app.route('/api/articles/saved')
		.all(middleware.tokenRequired)
		.get(routes.api.articles.saved.get)

	app.route('/api/article/:id')
		.all(middleware.tokenRequired)
		.get(routes.api.article.get)
		.post(routes.api.article.post)*/

	return app
}