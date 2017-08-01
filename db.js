var mongoose = require('mongoose');
//db connection settings
var mongooseConf = {
	"connectionOptions" : {
		"user" : "root",
		"pass" : "root",
		"auth" : {"authdb":"admin"},
		"authMechanism" : "MONGODB-CR"
		},
	"connectionString" : "mongodb://localhost/local"
}

mongoose.connect(mongooseConf.connectionString, mongooseConf.connectionOptions);

//collection schema
var userSchema = new mongoose.Schema({
	regId : String,
});

var user = mongoose.model('user', userSchema);

module.exports = {
	regIdExists : function(regId, callback){
		user.findOne({regId : regId}, function (err, foundUser) {
			callback(foundUser);
		});
	},

	//continue here
	insertRegId : function(regId){
		var newUser = new user({regId : regId});
		newUser.save();
		return newUser._id;
	},

	selectUsers : function(callback){
		user.find({}, function(err, foundUsers){
			callback(foundUsers);
		});
	},

}