function gameengine() {
}
gameengine.prototype.board = {
	tiles:[],
	hwalls:[],
	vwalls:[]
};

gameengine.prototype.findAllVertWallsOfLen = function(wallarray, walLen) {
	var output = [];
	for(var row=0;row<wallarray.length;row++) {
		for(var col=0;col<wallarray[row].walls.length;col++){
			var include = true;
			for(var t=row;t<row+walLen;t++){
				if(!wallarray[t] || !wallarray[t].walls[col] || wallarray[t].walls[col].blocked) {
					include = false;
					break;
				}
			}
			if(include) {
				output.push({prow:row,pcol:col});
			}
		}
	}
	return output;
};

gameengine.prototype.createRandomVertWalls = function(wallarray, possibles, wallsToBuild) {
	var winner = possibles[Math.floor(Math.random()*possibles.length)];
	for(var w=winner.prow;w<winner.prow+wallsToBuild;w++){
		wallarray[w].walls[winner.pcol].blocked = true;
	}
};

gameengine.prototype.randomWalls = function(wallarray) {
	var wallPercent = 0.2*Math.pow(wallarray.length,2);

	var walLen = 1;
	var walsBuilt = 0;
	while(walsBuilt < wallPercent) {
		var possibles = this.findAllVertWallsOfLen(wallarray, walLen);
		this.createRandomVertWalls(wallarray, possibles, walLen)

		walsBuilt += walLen;
		walLen+=1;
		if(walLen > 3){
			walLen=1;
		}
	}
};

gameengine.prototype.defineBoard = function(sq){
	this.board.tiles = [];
	this.board.hwalls = [];
	this.board.vwalls = [];

	var size = 16;
	this.board.tileSize = size;

	if(sq < 1){
		alert("why you no define larger board?");
		return;
	}

	for(var r=0;r<sq;r++) {
		this.board.tiles.push({rowid:r,columns:[]});
		for(var c=0;c<sq;c++){
			this.board.tiles[r].columns.push({
				colid:c,
				contents:null,
				x:(size*c)+c+1,
				y:(size*r)+r+1
			});
		}
	}

	//(n-1 * n)*2
	var hy=size+2;
	var vy=1;
	for(var rn=0;rn<sq;rn++){
		this.board.vwalls.push({rowid:rn,walls:[]});
		if(rn < sq-1) {
			this.board.hwalls.push({rowid:rn,walls:[]});
		}
		var hx=1;
		var vx=size+2;
		for(var cn=0;cn<sq;cn++) {
			if(rn < sq-1) {
				this.board.hwalls[rn].walls.push({
					walid:cn,
					blocked:false,
					x1:hx,
					x2:hx+size,
					y1:hy,
					y2:hy
				});
			}
			if(cn < sq-1) {
				this.board.vwalls[rn].walls.push({
					walid:cn,
					blocked:false,
					x1:vx,
					x2:vx,
					y1:vy,
					y2:vy+size
				});
			}
			hx+=(size+1);
			vx+=(size+1);
		}
		vy+=(size+1);
		hy+=(size+1);		
	}

	this.randomWalls(this.board.hwalls);
	this.randomWalls(this.board.vwalls);
};

gameengine.prototype.clearBoard = function() {
	this.board.tiles = [];
	this.board.hwalls = [];
	this.board.vwalls = [];
};

gameengine.prototype.drawCanvas = function() {
	var ctx = gamecanvas.getContext("2d");

	ctx.fillStyle = "#cccccc";
	var maxSize = ((this.board.tileSize+1)*(this.board.tiles.length))+1;
	ctx.fillRect(0,0,maxSize,maxSize);
	
	ctx.fillStyle = "#ffffff";
	for(var r=0; r<this.board.tiles.length; r++) {
		for(var c=0;c<this.board.tiles[r].columns.length;c++){
			var cell = this.board.tiles[r].columns[c];
			ctx.fillRect(cell.x,cell.y,this.board.tileSize,this.board.tileSize);
		}
	}

	ctx.fillStyle = "#000000";

	this.drawWall(ctx, this.board.hwalls);
	this.drawWall(ctx, this.board.vwalls);
};

gameengine.prototype.drawWall = function(ctx, wallarray) {
	for(var wr=0;wr<wallarray.length;wr++) {
		for(var wc=0;wc<wallarray[wr].walls.length;wc++) {
			var wall = wallarray[wr].walls[wc];
			if(wall.blocked) {
				ctx.moveTo(wall.x1,wall.y1);
				ctx.lineTo(wall.x2,wall.y2);
				ctx.stroke();
			}
		}
	}
}

gameengine.prototype.drawBoard = function() {
	this.clearBoard();

	var sq = parseInt(square.value);
	this.defineBoard(sq);

	this.drawCanvas();
};

var game = new gameengine();
playButton.addEventListener("click",game.drawBoard,false);
game.drawBoard();
