const schedule = require('node-schedule');
const getFolderSize = require('get-folder-size');

/* 
* Get data from the command line
*
* LOG_FOLDER = The directory where the logs are held in relation to the current directory
* MAX_SIZE = The maximum size the log folder is allowed to reach in bytes
* MOVE_FILES = The location in which to move the oldest log files if the folder passes the MAX_SIZE
* 
*/
var LOG_FOLDER = process.argv[2];
var MAX_SIZE = process.argv[3];
var MOVE_FILES = process.argv[4];

runHouseKeeping();

function runHouseKeeping(){
	try {
	 
	 	/* 
	 	* Run this job every night at midnight
	 	* I.e. everyday at 23:59:59pm 
		* var housekeeping = schedule.scheduleJob('59 59 23 * * *', function(){
		*/
		var housekeeping = schedule.scheduleJob('0-59 * * * * *', function(){
		  	
		  	// Get the size of the log folder
			getFolderSize(LOG_FOLDER, (err, size) => {
			  if (err) { throw err; }
			 
			  console.log(size + ' bytes');

			  // If the size is bigger than the maximum limit
			  if(size > MAX_SIZE){
			  	console.log('too big!');
			  }

			});

		});

	}
	catch (error) {
	  console.error('Error occurred:', error);
	}
}