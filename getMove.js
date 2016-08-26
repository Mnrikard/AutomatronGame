function callPlayer(info, player) {
	var exec= require('child_process').exec;
	
	var result = '';

	var child = exec(player.executable + ' ' + info);

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
