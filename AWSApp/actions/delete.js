var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
var INDEX_TEMPLATE = "sentPhoto.ejs";

var sqs = new AWS.SQS();
var QUEUE_URL = 'https://sqs.us-west-2.amazonaws.com/061357202774/208289-sqs';

var task = function (request, callback) {
	var fileList = JSON.parse(request.body.files2);
	var command = request.body.command;

	console.log("File will be deleted");

	for (var i = 0; i < fileList.length; i++) {
		var params = {
			MessageBody : JSON.stringify({
				file : fileList[i],
				command: command
			}),
			QueueUrl : QUEUE_URL
		};
		sqs.sendMessage(params, function (err, data) {
			if (err) {
				console.log(err, err.stact);
			} else {
				callback(null, {
					template : INDEX_TEMPLATE,
					params : {
						fields : null,
						bucket : null
					}
				});
			}
		});
	}
}

exports.action = task;
