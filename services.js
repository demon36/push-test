var db = require('./db');
var gcm = require('node-gcm');
var sender = new gcm.Sender('AIzaSyAcDkr8-aXdZGWzEk2BRCW5ujwjXzEojFw');

module.exports = {
	register : function(regId, callback){
		//validate regId
		var message = new gcm.Message({ dryRun: true });
		var regTokens = [regId];
		var failed = false;
		sender.send(message, { registrationTokens: regTokens }, function (err, response) {

			var invalidRegId = response.results && response.results[0] &&
		     response.results[0].error && response.results[0].error == "InvalidRegistration";

		    if (err){
		    	console.error(err);
		    	failed = true;
		    }else if(invalidRegId){
		    	callback("failure, invalid registration ID");
		    }else{
		    	db.regIdExists(regId, function(foundUser){
					if(!foundUser){
						db.insertRegId(regId);
						callback("success");
					}else{
						callback("failure, registration ID already exists");
					}
				});
		    }
		});
		
	},

	push : function(regId, callback){
		var message = new gcm.Message({ data: {} });
		var regTokens = [regId];

		db.regIdExists(regId, function(foundUser){
			if(foundUser){
				sender.send(message, { registrationTokens: regTokens }, function (err, response) {

				    if (err){
				    	console.error(err);
				    	failed = true;
				    }else if(response.success){
				    	callback("success");
				    }else{
				    	callback("failure, failed to send message");
				    }
				    
				});
			}else{
				callback("failure, registration ID does not exist");
			}
		});
	},

}