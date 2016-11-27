export.callPlayer = function(process) {
	var exec = require('child_process').exec;
	
	var result = '';

	var child = exec(process, function(a,b,c){ });

	child.stdout.on('data', function(data) {
	    result += data;
	});

	var doneWaiting = false;
	child.on('close', function() {
		doneWaiting = true;
	});

	while(!doneWaiting) {

	}
	return result;
}
