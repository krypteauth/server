var express = require('express'),
	bodyParser = require('body-parser'),
	logger = require('morgan'),
	session = require('express-session')

var routes = require('./routes'),
	middleware = require('./middleware')

exports = module.exports = function() {

	var app = express()

	app.set('x-powered-by', false);
	app.use(logger('combined'))
	app.set('view engine', 'ejs')
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(session({
		secret: 'itiscoolerino',
		resave: false,
		saveUninitialized: true
	}))
	app.use(express.static(__dirname + '/public'))

	app.route('/')
		.get(routes.web.root.get)

	app.route('/login')
		.get(routes.web.login.get)
		.post(middleware.isApi, routes.web.login.post)

	app.route('/logout')
		.get(middleware.isApi, routes.web.login.logout)

	app.route('/providers')
		//.all(middleware.sessionRequired)
		.get(middleware.isApi, routes.web.providers.get)

	app.route('/config')
		//.all(middleware.sessionRequired)
		.get(routes.web.config.get)
		.post(routes.web.config.post)

	app.route('/config/qr')
		.get(routes.web.config.qr.get)
		.post(routes.web.config.qr.post)

	app.route('/auth')
		//.all(middleware.sessionRequired)
		.get(routes.web.auth.get)
		.post(routes.web.auth.post)

	app.route('/data')
		.all(middleware.tokenRequired)
		.get(routes.web.data.get)
		
	return app
}