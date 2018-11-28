const schedule = require('node-schedule');
const getFolderSize = require('get-folder-size');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');

// Private key is stored here for now however, in production should be moved to a server config variable
const uploadcare = require('uploadcare')('254bcf1eacd25518ffeb', '1bc07154e5de0d22a756');

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
	 	 * This code snippet has been pulled and edited from:
	 	 * https://www.npmjs.com/package/node-schedule
	 	 * 
	 	 * Run this job every night at midnight
	 	 * I.e. everyday at 23:59:59pm 
		 */
		var housekeeping = schedule.scheduleJob('59 59 23 * * *', function(){
			checkLogFolder();
		});

	}
	catch (error) {
	  console.error('Error occurred:', error);
	}
}

/* 
 * This code snippet has been pulled and edited from:
 * https://www.npmjs.com/package/get-folder-size
 *
 * Return the file name of oldest file in the log directory
 */
function checkLogFolder(){
  	// Get the size of the log folder
	getFolderSize(LOG_FOLDER, (err, size) => {
	  	if (err) { throw err; }
	 
	  	// If the size is bigger than the maximum limit
	  	if(size > MAX_SIZE){

	  		var file = getOldestFileName(LOG_FOLDER);
	  		var path = LOG_FOLDER + '/' + file;

  			// If MOVE_FILES is unspecified, delete the oldest log file else, move files to remote location
  			if(MOVE_FILES == '' || MOVE_FILES == undefined){
				removeFile(path);
  			} else {
  				moveAndRemoveFile(path);
  				console.log('moving ' + path);
  			}

	  	}
	});
}

/*
 * This code snippet has been pulled and edited from:
 * https://github.com/RexMorgan/uploadcare-node
 *
 * Upload log file to uploadcare CDN and then remove it if successful
 */
function moveAndRemoveFile(path){
    uploadcare.file.upload(fs.createReadStream(path), function(err,res){
        
        // If move was successful, remove file
        if(!err){
            removeFile(path);
        } else {
        	console.log(err);
        }

    });	
}

function removeFile(path) {
  	fs.unlinkSync(path);

  	// Check folder again incase folder is still above MAX_SIZE
  	checkLogFolder();
}

/*
 * This code snippet has been pulled and edited from:
 * https://stackoverflow.com/a/26232399
 *
 * Return the file name of oldest file in the log directory
 */
function getOldestFileName(dir) {
    var files = fs.readdirSync(dir);

    //Iterate through directory, return the filename with the lowest creation time
    var oldest_file_name = _.min(files, function (f) {
        var fullpath = path.join(dir, f);
        return fs.statSync(fullpath).ctime;
    });
    
    return oldest_file_name;
}