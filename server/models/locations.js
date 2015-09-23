(function () {
	'use strict';

	var mongoose = require('mongoose'),
		locationsSchema = new mongoose.Schema ({
			latitude : {
				type: Number,
				unique: true,
				required: true
			},
			longitude : {
				type: Number,
				unique: true,
				required: true
			},
			radius : {
				type: Number,
				unique: true,
				required: true
			}//The radius in Kilometers
		});
	module.exports = mongoose.model('locations', locationsSchema);
}());
