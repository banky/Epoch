var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var exports = module.exports = {};

var url = 'mongodb://localhost:27017/mydb';

var collection;

MongoClient.connect(url, function (err, db) {
	if (err) {
		console.log('Unable to connect to the mongoDB server. Error: ', err);
	} else {
		//We are connected
		console.log('Connection established to ', url);

		//Do some work with the database
		collection = db.collection("users");


	}
});

//exports.blahblahblah add functions
