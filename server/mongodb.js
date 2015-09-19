(function () {
	'use strict';

	var mongodb = require('mongodb'),
		mongoose = require('mongoose'),

		db = mongoose.connection,

		http = require('http'),
		Locations = require('./locations');
	db.on('error', console.error);

	db.once('open', function () {
		exports.getLocations = function(req, res) {
			Locations.find(function (err, locations) {
				if (err) {
					console.log('Error in get locations: ' + err);
					res.status(404).send();
				}
				console.log(locations);
				res.json(locations).status(200);				
			}); 
		}
	});

	mongoose.connect('mongodb://localhost:27017/mydb');

}());