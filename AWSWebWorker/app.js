var AWS = require("aws-sdk");
var rotator = require('./actions/rotate');
AWS.config.loadFromPath('./config.json');
var InfiniteLoop = require('infinite-loop');
var infLoop = new InfiniteLoop;
var sqs = new AWS.SQS();
var async = require('async');

//infLoop.add(waitMsg,null).setInterval(100).run();


var waitMsg=function() {
	var params = {
		QueueUrl : 'https://sqs.us-west-2.amazonaws.com/061357202774/208289-sqs',
		MaxNumberOfMessages : 1,
		VisibilityTimeout : 30,
		WaitTimeSeconds : 20
	};

	sqs.receiveMessage(params, function (err, data) {
		if (err) {
			console.log("Error: " + err);
		} else {
			var msg = data.Messages || [];
			if (msg.length > 0) {
				var delParams = {
					QueueUrl : 'https://sqs.us-west-2.amazonaws.com/061357202774/208289-sqs',
					ReceiptHandle : JSON.parse(JSON.stringify(msg))[0]["ReceiptHandle"]
				};
				sqs.deleteMessage(delParams, function (err, data) {
					if (err) {
						console.log(err, err.stack);
					} else {
						rotator.rotate(msg);
					}
				});
			}
		}
	});
	setTimeout(waitMsg, 10000);
}

waitMsg();