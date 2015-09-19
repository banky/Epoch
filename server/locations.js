var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function() {
	var Locations = new Schema({
		latitude : Number,
		longitude : Number,
		radius : Number	//The radius in K
	});
	mongoose.model("Users", Users);
}
