var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
var INDEX_TEMPLATE = "sentPhoto.ejs";
var simpleDb = require("./simpleDB");

var sqs = new AWS.SQS();
var QUEUE_URL = 'https://sqs.us-west-2.amazonaws.com/061357202774/208289-sqs';

var fileList;
var task = function (request, callback) {
	var rotateDegrees = parseInt(request.body.rotateDegrees);
	fileList = JSON.parse(request.body.files);
	var direction = request.body.direction;
	var command = request.body.command;
	var attributes = [];

	console.log("Stopnie: " + rotateDegrees + ", kierunek: " + direction);

	for (var i = 0; i < fileList.length; i++) {
		var params = {
			MessageBody : JSON.stringify({
				"file" : fileList[i],
				"rotateDegrees": rotateDegrees,
				"direction": direction,
				"command": command
			}),
			QueueUrl : QUEUE_URL
		};
		attributes.push({
			Name: 'command',
			Value: JSON.stringify({ 
				'command': command, 
				'itemName': fileList[i],
				'rotateDegrees': rotateDegrees, 
				'direction': direction,
				'time': Date.now()
			})
		});

		simpleDb.putAttributes(fileList[i], attributes, function () {
			simpleDb.getFromDb(fileList[i-1]);
		});

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
