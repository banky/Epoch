(function () {
	'use strict';

	var mongoose = require('mongoose'),
		userSchema = new mongoose.Schema ({
			email : {
				type : String,
				unique : true,
				required : true
			},
			firstName : {
				type : String,
				unique : false,
				required : true
			},
			lastName : {
				type : String,
				unique : false,
				required : true
			},
			points : {
				type : Number,
				unique : false,
				required : true
			},
			homeBase : {
				latitude : {
					type : Number,
					unique : false,
					required : false
				},
				longitude : {
					type : Number,
					unique : false,
					required : false
				}
			},
			locationsVisited : []
		});
	module.exports = mongoose.model('users', userSchema);
}());
