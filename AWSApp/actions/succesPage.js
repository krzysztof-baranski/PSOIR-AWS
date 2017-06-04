var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
var simpleDB = require("./simpleDB");
var INDEX_TEMPLATE = "succesPage.ejs";

var task = function (request, callback) {
	var attributes = [];
	var params = {
		bucket : request.query.bucket,
		key : request.query.key
	};

	attributes.push({
		Name : 'name',
		Value : params.key
	});

	simpleDB.putAttributes(params.key, attributes, function () {
		simpleDB.getFromDb(params.key);
	});

	callback(null, {
		template : INDEX_TEMPLATE,
		params : {
			fileName : params.key
		}
	});
}

exports.action = task;
