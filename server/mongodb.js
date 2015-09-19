(function () {
	'use strict';

	var mongodb = require('mongodb'),
		mongoose = require('mongoose'),

		db = mongoose.connection,

		http = require('http'),
		https = require('https'),
		Locations = require('./locations'),
		User = require('./user'),
		config = require('./config'),
		apiKey = config.apiKey,
		apiSecret = config.apiSecret;

	db.on('error', console.error);

	db.once('open', function () {
		exports.getLocations = function(req, res) {
			Locations.find(function (err, locations) {
				if (err) {
					console.log('Error in get locations: ' + err);
					res.status(400).send();
				}
				res.json(locations).status(200);				
			}); 
		};

		//Commented out the if statement because we are not yet getting any actual locations
		exports.getNextTimeAtLocation = function(req, res) {
			//if (false) {
			//	console.log('Error. No location was received');
			//	res.status(404).send();
			//} else {
				var longitude = req.body.longitude;
				var latitude = req.body.latitude;

				var url = 'https://api.urthecast.com/v1/satellite_tracker/sensor_platforms/iris/forecasts?geometry_intersects=POINT(' + latitude + 
					'%' + latitude + ')&api_key=' + apiKey + '&api_secret=' + apiSecret;

				//Hacky way
				https.request(options, function (response) {
	  				var str = '';

					//another chunk of data has been recieved, so append it to `str`
					response.on('data', function (chunk) {
						str += chunk;
					});

					//the whole response has been recieved, so we just print it out here
					response.on('end', function () {
						var parsed = JSON.parse(str);
						res.json(str).status(200);
						console.log(str);
					});
				}).end();
			//}
		};


		exports.addLocations = function(req,res) {
			Locations.findOne({'id': req.user._id}, function(err,user){
				if(err){
					console.log('Error finding user in addLocations:' + err);
					res.status(400).send();
				}

				else{
					locations.latitude.push(req.body.latitude);
					locations.longitude.push(req.body.longitude);
					locations.radius.push(req.body.radius);
					locations.save(function(err,user){
						if(err){
							console.log('An error occured while adding the new location:' + err);

						}

						else{
							res.status(200);
						}
					});
				}
			});
		};
	mongoose.connect('mongodb://localhost/mydb');

		exports.getUserPoints = function(req, res) {
			//Cannot test until we have functional login.
			User.findOne({'_id': req.user._id}, function (err, user) {
				if (err) {
					console.log('Error finding user in getUserPoints: ' + err);
					res.status(400).send
				} else {
					console.log('Getting user points');
					res.json(user.points).status(200);
				}
			});
		};

		exports.changePoints = function (req, res) {
			//Cannot test until we have a functional login
			User.findOne({'_id': req.user._id}, function (err, user) {
				if (err) {
					console.log('Error finding user in changePoints: ' + err);
				} else {
					user.points = user.points + req.body.changeInPoints;
					user.save (function (err, user) {
						if (err) {
							console.log('Error saving user in changePoints: ' + err);
							res.status(400).send();
						} else {
							console.log('Points changed successfully');
							res.status(200).send();
						}
					});
				}
			});
		}

	});

	mongoose.connect('mongodb://localhost:27017/mydb');


}());