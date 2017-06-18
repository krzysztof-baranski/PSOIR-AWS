var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
var simpleDb = require("./simpleDB");
var INDEX_TEMPLATE = "succesPage.ejs";

var task = function (request, callback) {
	var attributes = [];
	var params = {
		bucket : request.query.bucket,
		key : request.query.key
	};
	var domainName = '208289';

	attributes.push({
		Name : 'name',
		Value : params.key
	});

	simpleDb.listDomains(function (data) {
		if (data && data.length > 0 && data.indexOf(domainName) !== -1) {
			return;
		}
		simpleDb.createDomain(domainName);
	}); 

	simpleDb.putAttributes(params.key, attributes, function () {
		simpleDb.getFromDb(params.key);
	});

	callback(null, {
		template : INDEX_TEMPLATE,
		params : {
			fileName : params.key
		}
	});
}

exports.action = task;
