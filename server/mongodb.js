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
	});
	mongoose.connect('mongodb://localhost/mydb');

}());