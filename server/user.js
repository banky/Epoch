(function () {
	'use strict';

	var mongoose = require('mongoose'),
		userSchema = new mongoose.Schema ({
			firstName : {
				type : String,
				unique : true,
				required : true
			},
			lastName : {
				type : String,
				unique : true,
				required : true
			}, 
			points : {
				type : Number,
				unique : true,
				required : true
			},
			homeBase : {
				latitude : {
					type : Number,
					unique : true,
					required : true
				},
				longitude : {
					type : Number,
					unique : true,
					required : true
				}
			},
			locationsVisited : []
		});
	module.exports = mongoose.model('users', userSchema);
}());
