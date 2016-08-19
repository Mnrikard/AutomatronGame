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
	var wallPercent = 0.2*wallarray.length;

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

	if(sq < 1){
		alert("why you no define larger board?");
		return;
	}

	for(var r=0;r<sq;r++) {
		this.board.tiles.push({rowid:r,columns:[]});
		for(var c=0;c<sq;c++){
			this.board.tiles[r].columns.push({colid:c,contents:null});
		}
	}

	//(n-1 * n)*2
	for(var rn=0;rn<sq;rn++){
		this.board.vwalls.push({rowid:rn,walls:[]});
		if(rn < sq-1) {
			this.board.hwalls.push({rowid:rn,walls:[]});
		}
		for(var cn=0;cn<sq;cn++) {
			if(rn < sq-1) {
				this.board.hwalls[rn].walls.push({walid:cn,blocked:false});
			}
			if(cn < sq-1) {
				this.board.vwalls[rn].walls.push({walid:cn,blocked:false});
			}
		}
	}

	this.randomWalls(this.board.hwalls);
	this.randomWalls(this.board.vwalls);
};

gameengine.prototype.clearBoard = function() {
	this.board.tiles = [];
	this.board.hwalls = [];
	this.board.vwalls = [];

	while(gameboard.firstChild) {
		gameboard.removeChild(gameboard.firstChild);
	}
};

gameengine.prototype.addTileRow = function(row){
	var curRow = dom.createElement("div");
	curRow.id = "row"+row;
	curRow.className = "row";
	gameboard.appendChild(curRow);
	return curRow;
};

gameengine.prototype.addTile = function(column, rowindex, colindex) {
	var tile = dom.createElement("div");
	tile.className="tile";
	tile.id = "tiler"+rowindex+"c"+colindex;
	if(column.contents) {
		tile.innerHTML = column.contents;
	} else {
		tile.innerHTML = "&nbsp;";
	}
	gameboard.appendChild(tile);
};

gameengine.prototype.addWall = function(wall, row, col, classNm) {
	var wall = dom.createElement("div");
	wall.className = classNm;
	wall.id = "wallr"+row+"c"+col;
	wall.innerHTML = "&nbsp;";
	gameboard.appendChild(wall);
};

gameengine.prototype.drawBoard = function() {
	this.clearBoard();

	var sq = parseInt(square.value);
	this.defineBoard(sq);

	for(var row=0;row<this.board.tiles.length;row++) {
		var curRow = this.addTileRow(row);

		for(var col=0;col < this.board.tiles[row].columns.length;col++){
			this.addTile(this.board.tiles[row].columns[col],row,col);
			if(col < this.board.vwalls[row].walls.length) {
				this.addWall(this.board.vwalls[row].walls[col], row, col, "hwall");
			}
		}

		if(row < this.board.hwalls.length) {
			for(col=0;col < this.board.hwalls[row].walls.length;col++) {
				this.addWall(this.board.hwalls[row].walls[col], row, col, "vwall");
			}
		}
	}
};

var game = new gameengine();
playButton.addEventListener("click",game.drawBoard,false);
game.drawBoard();
