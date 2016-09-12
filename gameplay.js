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

exports.drawBot = function(player) {
	this.randomPlacement(player);
	var avatar = new Image();
	avatar.src = player.image;
	var ctx = gamecanvas.getContext("2d");
	var px = (gamesettings.tileSize+1) * player.col;
	var py = (gamesettings.tileSize+1) * player.row;
	ctx.drawImage(avatar,px,py,gamesettings.tileSize,gamesettings.tileSize);
};

exports.startGame = function(boardDef, settings) {
	this.board = boardDef;
	gamesettings = settings;
	for(var p=0;p<gamesettings.players.length;p++){
		this.drawBot(gamesettings.players[p]);
	}
	this.gameTimer = setInterval(this.makeMoves, gamesettings.frameRate);
};

exports.makeMoves = function() {

};

