var db = require('./db');
var gcm = require('node-gcm');
const assert = require('assert');

var sender = new gcm.Sender('AIzaSyAcDkr8-aXdZGWzEk2BRCW5ujwjXzEojFw');

module.exports = {
	register : function(regId, callback){
		//validate regId via a dummy message in dry run mode
		var message = new gcm.Message({ dryRun: true });
		var regTokens = [regId];
		sender.send(message, { registrationTokens: regTokens }, function (err, response) {

			//check if registration ID is valid
			var invalidRegId = response.results && response.results[0] &&
		     response.results[0].error && response.results[0].error == "InvalidRegistration";

		    //check if sending encountered a problem like bad API key
		    if (err){
		    	console.error(err);
		    	callback("failure, failed to send message");
		    }else if(invalidRegId){
		    	callback("failure, invalid registration ID");
		    }else{
		    	//register id only if it is not already there
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

		db.regIdExists(regId, function(foundUser){
			if(foundUser){
				//send empty message if regId is stores in db
				var message = new gcm.Message({ data: {} });
				var regTokens = [regId];
				sender.send(message, { registrationTokens: regTokens }, function (err, response) {
					
				    if(response.success){
				    	callback("success");
				    }else{
				    	console.error(err);
				    	callback("failure, failed to send message");
				    }
				    
				});
			}else{
				callback("failure, registration ID does not exist");
			}
		});
	},

}