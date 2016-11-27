var gamesettings = null;
var board = null;
var fs = require('fs');

exports.getBoard = function(){
	return board;
}

exports.getRandomPlacement = function() {
	var rx = Math.floor(Math.random()*board.tiles.length);
	var ry = Math.floor(Math.random()*board.tiles.length);
	return {"row":ry,"col":rx};
};

exports.randomPlacement = function(player){
	while(true){
		var pos = this.getRandomPlacement();
		for(var p=0;p<gamesettings.players.length;p++) {
			if(gamesettings.players[p].row == pos.row && gamesettings.players[p].col == pos.col) {
				continue;
			}
		}
		player.row = pos.row;
		player.col = pos.col;
		break;
	}
};

exports.gameTimer = null;

function getRotateOffsetX(dir){
	if(dir.match(/[sw]/i)){
		return -gamesettings.tileSize;
	}
	return 0;
};

function getRotateOffsetY(dir){
	if(dir.match(/[es]/i)){
		return -gamesettings.tileSize;
	}
	return 0;
}

function rotateDirection(dir){
	if(dir.match(/e/i)){
		return 90;
	} else if(dir.match(/s/i)){
		return 180;
	} else if(dir.match(/w/i)){
		return 270;
	}
	return 0;
}

function cleanDirectoryBeforeGame(){
	fs.readdir(gamesettings.savelocation, (err, files) => {
		files.forEach(file => {
			if(file.match(/^board.+json$/i)){
				fs.unlink(gamesettings.savelocation+"/"+file);
			}
		});
	});
}

exports.drawBot = function(player, direction) {
	this.randomPlacement(player);
	var avatar = new Image();
	avatar.src = player.image;
	var ctx = gamecanvas.getContext("2d");
	ctx.save();
	var px = (gamesettings.tileSize+1) * player.col;
	var py = (gamesettings.tileSize+1) * player.row;
	ctx.translate(px,py);
	ctx.rotate(rotateDirection(direction)*Math.PI/180);
	ctx.drawImage(avatar,getRotateOffsetX(direction),getRotateOffsetY(direction),gamesettings.tileSize,gamesettings.tileSize);
	ctx.restore();
};

exports.startGame = function(boardDef, settings) {
	board = boardDef;
	gamesettings = settings;
	cleanDirectoryBeforeGame();
	for(var p=0;p<gamesettings.players.length;p++){
		this.drawBot(gamesettings.players[p],"s");
	}
	this.gameTimer = setTimeout(this.makeMoves, gamesettings.frameRate);
};

function buildBoardInfo(){
	var output = {
		"size":gamesettings.square,
		"walls":{
			horiz:[],
			vert:[]
		},
		"items":[]
	}

	for(var p=0; p<gamesettings.players.length;p++) {
		output.items.push({"item":"player","col":gamesettings.players[p].col,"row":gamesettings.players[p].row});
	}

	board.walls.vert.forEach(function(wallrow,rowid){
		wallrow.walls.forEach(function(wallcol,colid){
			if(wallcol.blocked){
				output.walls.vert.push({"row":wallrow.rowid,"col":wallcol.walid});
			}
		});
	});

	board.walls.horiz.forEach(function(wallrow,rowid){
		wallrow.walls.forEach(function(wallcol,colid){
			if(wallcol.blocked){
				output.walls.horiz.push({"row":wallrow.rowid,"col":wallcol.walid});
			}
		});
	});

	return output;
}

function getFileSaveLoc(){
	var now = new Date();
	var h = 100 + now.getHours();
	var m = 100 + now.getMinutes();
	var s = 100 + now.getSeconds();
	var f = 1000 + now.getMilliseconds();

	var txt = "board."+h.toString().substring(1)+
	m.toString().substring(1)+
	s.toString().substring(1)+
	f.toString().substring(1);

	return gamesettings.savelocation+"/board."+txt+".json";
}

function writeFile(name, content){
	fs.writeFile(name, content, function(err) {
		if(err) {
			return console.log(err);
		}
	});
}

exports.makeMoves = function() {
/*
 * request move
 * stage move
 * throw away clashes
 * animate orient pieces
 * animate move
 *
 * */

	var file = getFileSaveLoc();
	var stringboard = JSON.stringify(buildBoardInfo());
	writeFile(file, stringboard);

	var exec = require('child_process').exec;

	for(var p=0; p<gamesettings.players.length;p++) {
		var runthis;
		if(gamesettings.players[p].input === "file"){
			runthis = exec(gamesettings.players[p].executable+" \""+file+"\"", function(a,b,c){ });
		}else{
			runthis = exec(gamesettings.players[p].executable+" "+stringboard, function(a,b,c){ });
		}
		gamesettings.players[p].response = runthis;
	}


};

