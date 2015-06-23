
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: String,
	username: String,
	password: String,
	email: String,
	latitude:String,
	longitude:String, 
	date: {
        type: Date,
        default: Date.now
    }
});




