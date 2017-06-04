var AWS = require("aws-sdk");
AWS.config.loadFromPath('./config.json');
var simpleDB = require("./simpleDB");
var INDEX_TEMPLATE = "gallery.ejs";
var s3 = new AWS.S3();
var bucketName = "208289-bucket";

var params = {
	Bucket: bucketName
};
var task = function (request, callback) {
	s3.listObjects(params, function (err, data) {
		if (err) console.log(err, err.stack);
		else {
			data.Contents.shift();
			callback(null, {
				template: INDEX_TEMPLATE , params: {
					bucket: bucketName,
					files: data.Contents
				}
			});
		}
	});
}

exports.action = task;