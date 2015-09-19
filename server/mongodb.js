(function () {
	'use strict';

	var mongodb = require('mongodb'),
		mongoose = require('mongoose'),

		db = mongoose.connection,

		http = require('http');
		Locations = require('./locations');
	db.on('error', console.error);

	db.once('open', function () {
		exports.getLocations = function(req, res) {
			Locations.find(function (err, locations) {
				if (err) {
					
				}
			}); 
		}

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

}());