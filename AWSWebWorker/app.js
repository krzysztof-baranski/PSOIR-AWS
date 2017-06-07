var AWS = require("aws-sdk");
var rotator = require('./actions/rotate');
var deletor = require('./actions/delete');
AWS.config.loadFromPath('./config.json');
var InfiniteLoop = require('infinite-loop');
var infLoop = new InfiniteLoop;
var sqs = new AWS.SQS();
var async = require('async');

var QUEUE_URL = 'https://sqs.us-west-2.amazonaws.com/061357202774/208289-sqs';
//infLoop.add(waitMsg,null).setInterval(100).run();

console.log("WebWorker started...")

var waitMsg = function() {
	var params = {
		QueueUrl : QUEUE_URL,
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
					QueueUrl : QUEUE_URL,
					ReceiptHandle : JSON.parse(JSON.stringify(msg))[0]["ReceiptHandle"]
				};
				sqs.deleteMessage(delParams, function (err, data) {
					if (err) {
						console.log(err, err.stack);
					} else {
						var msgBody = JSON.parse(JSON.stringify(msg))[0]["Body"];
						var command = JSON.parse(msgBody).command;

						console.log("Command: ", command);
						switch (command) {
							case 'rotate':
								rotator.rotate(msg);
								break;
							case 'delete':
								deletor.delete(msg);
								break;
						}
					}
				});
			}
		}
	});
	setTimeout(waitMsg, 10000);
}

waitMsg();