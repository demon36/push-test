var db = require('./db');

module.exports = {
	register : function(regId, callback){
		db.regIdExists(regId, function(foundUser){
			if(!foundUser){
				db.insertRegId(regId);
				callback("success");
			}else{
				callback("failure");
			}
		});
	},

	push : function(regId, callback){
		db.regIdExists(regId, function(foundUser){
			if(foundUser){
				callback("success");
			}else{
				callback("failure");
			}
		});
	},

}