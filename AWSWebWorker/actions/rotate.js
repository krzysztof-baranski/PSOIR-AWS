var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
var sqs = new AWS.SQS();
var s3 = new AWS.S3();
var lwip = require('lwip');
var bucketName = "208289-bucket";

function rotate(msg) {
	var msgBody = JSON.parse(JSON.stringify(msg))[0]["Body"];
	var file = JSON.parse(msgBody).file;
	// console.log(JSON.stringify(msgBody));
	var degs = JSON.parse(msgBody).rotateDegrees;
	var direction = JSON.parse(msgBody).direction;

	var params = {
		Bucket : bucketName,
		Key : file
	};

	var color = { 
		r: 255, 
		g: 255, 
		b: 255, 
		a: 100 
	};

	s3.getObject(params, function (err, data) {
		if (err) {
			console.log("Error: " + err);
		} else {
			lwip.open(data.Body, 'jpg', function (err, image) {
				if (err) {
					console.log("Error: " + err);
				} else {

					if (direction === 'left') {
						degs = 360 - degs;
						direction = 'w lewo';
					} else {
						direction = 'w prawo';
					}

					image.rotate(degs, color, function (err, image) {
						if (err) {
							console.log("Error: " + err);
						} else {
							image.toBuffer('jpg', function (err, buffer) {
								if (err) {
									console.log("Error: " + err);
								} else {
									var nextParams = {
										Bucket : params.Bucket,
										Key : params.Key,
										Body : buffer,
										ACL : 'public-read'
									};

									s3.upload(nextParams, function (err, data) {
										if (err) {
											console.log("Error: " + err);
										} else {
											var time = require('time');
											var now = new time.Date();
											now.setTimezone('Europe/Warsaw');

											console.log(now.toString() + " Plik " + file + " zostal obrócony o " + 
												degs + " stopni " + direction);
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
}
exports.rotate = rotate;
