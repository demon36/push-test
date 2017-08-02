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

	//check regId exists
	regIdExists : function(regId, callback){
		user.findOne({regId : regId}, function (err, foundUser) {
			callback(foundUser);
		});
	},

	insertRegId : function(regId, callback){
		var newUser = new user({regId : regId});
		newUser.save(function(err){
			callback(newUser);
		});
	},

	removeUser : function(regId){
		user.remove({regId : regId}, function (err) {
			console.log(err);
		});
	},

}