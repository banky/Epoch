(function () {
	'use strict';

	var mongoose = require('mongoose'),
		challengeSchema = new mongoose.Schema ({
			name : {
				type: String,
				unique: false,
				required: true
			},
			aoid : {
				type: String,
				unique: true,
				required: true
			}
		});
	module.exports = mongoose.model('challenge', challengeSchema);
}());
