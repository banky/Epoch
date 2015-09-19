(function () {
	'use strict';

	var mongodb = require('mongodb'),
		mongoose = require('mongoose'),

		db = mongoose.connection,

		http = require('http'),
		https = require('https'),
		Locations = require('./locations'),
		User = require('./users'),
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
				var url = 'https://api.urthecast.com/v1/satellite_tracker/sensor_platforms/iris/forecasts?geometry_intersects=POINT(-122.27508%2037.81195)&api_key=' + apiKey + '&api_secret=' + apiSecret;

				//Hacky way
				https.request(options, function (response) {
	  				var str = '';

					//another chunk of data has been recieved, so append it to `str`
					response.on('data', function (chunk) {
						str += chunk;
					});

					//the whole response has been recieved, so we just print it out here
					response.on('end', function () {
						res.json(str).status(200);
						console.log(str);
					});
				}).end();
			//}
		}

		exports.getUserPoints = function(req, res) {
			User.findOne({'_id': req.user._id}, function (err, user) {
				if (err) {
					console.log('Error finding user in getUserPoints: ' + err);
					res.status(400).send
				} else {
					console.log('Getting user points');
					res.json(user.points).status(200);
				}
			});
		}

	});

	mongoose.connect('mongodb://localhost:27017/mydb');

}());