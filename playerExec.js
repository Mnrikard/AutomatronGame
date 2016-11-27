exports.playerExec = function(process) {
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

	var timeout = new Date();
	timeout.setSeconds(timeout.getSeconds()+10);
	while(!doneWaiting) {
		if((new Date()) > timeout){
			doneWaiting = true;
			result = "{\"action\":\"timeout\"}";
		}
	}
	return result;
};
