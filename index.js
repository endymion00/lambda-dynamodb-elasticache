var redis = require("redis");

function handler(event, context, callback) {
    console.log(JSON.stringify(event));

    var redisClient = redis.createClient({host: "ser-el-1nole16f83cy5.udcuwc.0001.use1.cache.amazonaws.com"});

    event.Records.forEach(function(record) {
        var key = record.dynamodb.Keys.Id.S;
    	if (record.eventName === "INSERT" || record.eventName === "MODIFY") {
    		var value = JSON.stringify(record.dynamodb.NewImage);
    		console.log("Updating cache: " + key + ": " + value);
    		redisClient.set(key, value, function(err) {
    			if(err) {
    				callback(err);
    			} else {
    				redisClient.quit();
    				callback(null, "DONE");
    			}
    		});
    	} else if (record.eventName === "REMOVE") {
    		console.log("Deleting cache: " + key);
    		redisClient.del(key, function(err) {
    			if(err) {
    				callback(err);
    			} else {
    				redisClient.quit();
    				callback(null, "DONE");
    			}
    		});
    	}
    });

    redisClient.on("error", function (err) {
		console.log("Error " + err);
	});
};

exports.handler = handler;