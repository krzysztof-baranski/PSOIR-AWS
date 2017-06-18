var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');

var simpledb = new AWS.SimpleDB();
var domainName = "208289";

var createDomain = function (name, callback) {
	if (name) {
		domainName = name;
	}

	var params = {
		DomainName : domainName /* required */
	};
	
	simpledb.createDomain(params, function (err, data) {
		if (err) {
			console.log("@@ createDomain");
			console.log(err, err.stack); // an error occurred
		} else {
			console.log('Utworzono SimpleDB Domain'); // successful response
			callback();
		}
	});
}

var getFromDb = function (itemName) {
	var params = {
		DomainName : domainName,
		/* required */
		ItemName : itemName,
		/* required */
	};
	simpledb.getAttributes(params, function (err, data) {
		if (err) {
			console.log(err, err.stack); // an error occurred
		} else {
			console.log('Wiadomosc getAttributes ' + JSON.stringify(data)); // successful response
		}
	});
}

var selectFromDb = function (callback) {
	var selectExpression = "select * from " + domainName;
	var params = {
		SelectExpression : selectExpression
	};
	simpledb.select(params, function (err, data) {
		if (err) {
			console.log(err, err.stack); // an error occurred
		} else {
			callback(data);
			// successful response
		}
	});
}

var putAttributes = function (itemName, attributes, callback) {
	var params = {
		Attributes : attributes,
		DomainName : domainName,
		/* required */
		ItemName : itemName,
		/* required */
	};

	simpledb.putAttributes(params, function (err, data) {
		if (err) {
			console.log(err, err.stack); // an error occurred
		} else {
			console.log('Zapisano do SimpleDB'); // successful response
			callback();
		}
	});
}

var listDomains = function (callback) {
	var params = {
		MaxNumberOfDomains : 10
	}

	simpledb.listDomains(params, function (err, data) {
		if (err) {
			console.log(err, err.stack);
		} else {
			callback(data.DomainNames);
		}
	})
}

/*
var task = function(request, callback){
selectFromDb(function(data){
callback(null,data);
});
};



exports.action = task;*/

exports.getFromDb = getFromDb;
exports.createDomain = createDomain;
exports.putAttributes = putAttributes;
exports.selectFromDb = selectFromDb;
exports.listDomains = listDomains;