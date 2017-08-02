const assert = require('assert');
var db = require('./db');
var services = require('./services');

module.exports = {

	testDb : function(){
		var regId = Math.floor(Math.random() * 1000);
		db.insertRegId(regId, function(){
			db.regIdExists(regId, function(foundUser){
				//check entry exists after insertion
				assert.equal(regId, foundUser.regId);
				db.removeUser(regId, function(){
					db.regIdExists(regId, function(foundUser){
						//check entry does not exist after removal
						assert.equal(foundUser, null);
					});
				});
			});
		});
	},

	testApi : function(){
		var regId = "c5355j-XGEI:APA91bEkYswCt3nmHDT6FGDGMh1yioSFmYfJqcd7kURBkc6RXEuKnG_fklkLU7wX1X1zS_r5ZYmlePOGx3G6VonnaNGTrSwOSCKKi8XJqrbFDA7gtvvOOYoOmmNWV4yG0i_O0rl-0k6n";
		//make sure Id is not previously entered before testing
		db.removeUser(regId, function(){
			services.push(regId, function(status){
				//assert pushing a message fails when id is not registered
				assert.equal(status.indexOf("failure"), 0);
			});
			services.register(regId, function(status){
				//assert registration succeeds when not entered before
				assert.equal(status.indexOf("success"), 0);
				services.register(regId, function(status){
					//assert registration fails when id is previously entered
					assert.equal(status.indexOf("failure"), 0);
					db.removeUser(regId, function(){});
				});
			});
		});

		var regId2 = "badRegId";
		services.register(regId2, function(status){
			//assert bad registration id validation fails
			assert.equal(status.indexOf("fail"), 0);
		});
	},

}