var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
var sqs = new AWS.SQS();
var s3 = new AWS.S3();
var bucketName = "208289-bucket";

function deleteObject (msg) {
	var msgBody = JSON.parse(JSON.stringify(msg))[0]["Body"];
	var file = JSON.parse(msgBody).file;
	var degs = JSON.parse(msgBody).rotateDegrees;
	var direction = JSON.parse(msgBody).direction;

	var params = {
		Bucket : bucketName,
		Key : file
	};

	s3.deleteObject(params, function (err, data) {
		if (err) console.log("Error deleteObject ", err);
		else console.log(params.Key + " deleted from " + params.Bucket);
	});
}
exports.delete = deleteObject;
