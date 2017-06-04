var AWS = require("aws-sdk");
var helpers = require("../helpers");

AWS.config.loadFromPath('./config.json');

	var task =  function(request, callback){
		
		var params ={
		Bucket: request.query.bucket,
		Key: request.query.key
		};
	
	var s3=new AWS.S3();


	//callback(null, "Dodano do bucket: " + bucket + " " + "za pomoca klucza: " + key);

	s3.getObject(params, function(err, data) {
		if(err) {callback(err); return;}
		var doc = data.body;
		var algorithms=['md5','sha1','sha256','sha512'];
		var loopCount =1;

			helpers.calculateMultiDigest(doc, 
				algorithms, 
				function(err, digests) {
					callback(null, digests.join("<br>"));	
				}, 
				loopCount);
			
	});

}

exports.action = task