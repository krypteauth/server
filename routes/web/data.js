var Info = require('mongoose').model('Info')

var getData = function (req, res){

	Info.find({key:{$in:req.token.permissions}}, function (err, infos) {
		if (err) {
			res.sendStatus(500)
		} else {

			var data = {}

			for (var k in infos) {
				data[infos[k].key] = infos[k].value
			}

			res.send({data:data})
		}
	})
}

module.exports = {
	get: getData
}