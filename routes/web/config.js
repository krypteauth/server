var tfa = require('speakeasy'),
	async = require('async')
var middleware = require('../../middleware')

var Credential = require('mongoose').model('Credential'),
	Info = require('mongoose').model('Info')

var getConf = function (req, res){

	var data = {}

	Info.find({}, function (err, infos) {

		if (err) {

			res.sendStatus(500)
		} else {

			async.reduce(infos, {}, function (v, inf, cb) {
				v[inf.key] = inf.value
				cb(null, v)
			}, function (err, vs){

				res.render('config', {data:vs, error:req.query['error']})
			})
		}
	})
}

var postConf = function (req, res){

	var form = req.body

	var as = []
	for (var k in form) {
		as.push([k, form[k]])
	}

	async.eachSeries(as, function(a, cb) {
		Info.findOne({key: a[0]}, function (err, i){
			if (err || !i) {
				i = new Info({key: a[0]})
			} 

			i.value = a[1]
			i.save(cb)
		}) 
	}, function (err) {
		if (!err) {
			if (!req.isApi) {
				res.redirect('/config')
			} else {
				res.sendStatus(200)
			}
		}
	})
}

var getQR = function (req, res){

	Credential.count(function (err, c){
		if (err || (c != 0 && !req.session.auth)) {
			res.sendStatus(403)
		} else {
			var key = tfa.generate_key({length: 20, google_auth_qr: true})
			res.render('qr', {qrURL:key.google_auth_qr, key: key.base32, error: req.query['error']})
		}
	})
}

var postQR = function (req, res){

	var key = req.body['key'],
		code = req.body['code'] || req.body['code1']+req.body['code2']+req.body['code3']+req.body['code4']+req.body['code5']+req.body['code6']

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