exports.board = null;
var gamesettings = null;

exports.getRandomPlacement = function() {
	var rx = Math.floor(Math.random()*this.board.tiles.length);
	var ry = Math.floor(Math.random()*this.board.tiles.length);
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
};

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
	this.board = boardDef;
	gamesettings = settings;
	for(var p=0;p<gamesettings.players.length;p++){
		this.drawBot(gamesettings.players[p],"s");
	}
	this.gameTimer = setInterval(this.makeMoves, gamesettings.frameRate);
};

exports.makeMoves = function() {

};

