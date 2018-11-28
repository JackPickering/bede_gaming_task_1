var schedule = require('node-schedule');

// Get token data
var LOG_FOLDER = process.argv[2];
var MAX_SIZE = process.argv[3];
var MOVE_FILES = process.argv[4];

runHouseKeeping();

function runHouseKeeping(){
	try {
	 
	 	// Run this job every night at midnight
	 	// I.e. everyday at 23:59:59pm 
		var housekeeping = schedule.scheduleJob('59 59 23 * * *', function(){
		  	
		  



		});

	}
	catch (error) {
	  console.error('Error occurred:', error);
	}
}