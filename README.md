# bede_gaming_task_1
Bede gaming task 1: A housekeeping automation script

This script checks the specified logs folder every day at midnight. It will check the folder size against a specified maximum size in bytes and either move the oldest log files to a remote location or just delete them.

Run this script by:

`node index.js logs 100 true`

logs = the direcotry of the log folder in relation to the script
100 = number of bytes that the logs folder is allowed to reach before cleaning

true = move logs to a remote location (this is using uploade cares CDN, please provide your own public/private key in the module to test this out)

NOTE: If you would like to just delete the files wihtout moving them to a remote location, simply run:

`node index.js logs 100`
