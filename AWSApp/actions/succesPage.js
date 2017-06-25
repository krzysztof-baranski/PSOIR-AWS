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

	// simpleDb.selectFromDb(function(data){
	// 	console.log("!!@ selectFromDb ", data);
		
	// 	if (!data || !data.length) {
	// 		return;
	// 	}

	// 	for (var i=0; i<data.Items.length; i++) {
	// 		simpleDb.removeAttributes(data.Items[i].Name, function (data) {
	// 			console.log('Attributes deleted! ', data.Items[i-1]);
	// 			simpleDb.getFromDb(data.Items[i-1].Name);
	// 		});
	// 	}
	// });	

	callback(null, {
		template : INDEX_TEMPLATE,
		params : {
			fileName : params.key
		}
	});
}

exports.action = task;
