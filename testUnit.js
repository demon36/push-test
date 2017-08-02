const assert = require('assert');
var db = require('./db');

module.exports = {

	testDb : function(){
		var regId = Math.floor(Math.random() * 1000);
		db.insertRegId(regId, function(){
			db.regIdExists(regId, function(foundUser){
				//check entry exists after insertion
				assert.equal(regId, foundUser.regId);
				db.removeUser(regId);
				db.regIdExists(regId, function(foundUser){
					//check entry does not exist after removal
					assert.equal(foundUser, null);
				});
			});
		});
	},

	testApi : function(){
		
	},


}