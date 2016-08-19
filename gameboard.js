function gameboard() {
var board = {
	tiles:[],
	hwalls:[],
	vwalls:[]
};

function findAllVertWallsOfLen(wallarray, walLen) {
	var output = [];
	for(var row=0;row<wallarray.length;row++) {
		for(var col=0;col<wallarray[row].columns.length;col++){
			var include = true;
			for(var t=row;t<row+walLen;t++){
				if(!wallarray[t] || !wallarray[t].columns[col] || wallarray[t].columns[col].blocked) {
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
}

function createRandomVertWalls(wallarray, possibles, wallsToBuild) {
	var winner = possibles[Math.floor(Math.random()*possibles.length)];
	for(var w=winner.prow;w<winner.prow+wallsToBuild;w++){
		wallarray[w].columns[winner.pcol].blocked = true;
	}
}

function randomWalls(wallarray) {
	var wallPercent = 0.2*wallarray.length;

	var walLen = 1;
	var walsBuilt = 0;
	while(walsBuilt < wallPercent) {
		var possibles = findAllVertWallsOfLen(wallarray, walLen);
		createRandomVertWalls(wallarray, possibles, walLen)

		walsBuilt += walLen;
		walLen+=1;
		if(walLen > 3){
			walLen=1;
		}
	}
	buildRandomVertWalls(wallarray);
	buildRandomHorizWalls(wallarray);
}

function defineBoard(sq){
	board.tiles = [];
	board.hwalls = [];
	board.vwalls = [];

	if(sq < 1){
		alert("why you no define larger board?");
		return;
	}

	for(var r=0;r<sq;r++) {
		board.tiles.push({rowid:r,columns:[]});
		for(var c=0;c<sq;c++){
			board.tiles[r].columns.push({colid:c,contents:null});
		}
	}

	//(n-1 * n)*2
	for(var rn=0;rn<sq;rn++){
		if(rn < sq-1) {
			board.hwalls.push({rowid:rn,walls:[]});
		}
		board.vwalls.push({rowid:rn,walls:[]});
		for(var cn=0;cn<sq;cn++) {
			board.hwalls[rn].walls.push({walid:cn,blocked:false});
			if(cn < sq-1) {
				board.vwalls[rn].walls.push({walid:cn,blocked:false});
			}
		}
	}

	randomWalls(board.hwalls);
	randomWalls(board.vwalls);
}

var domBoard = dom.getElementById('board');
var domSquare = dom.getElementById('

function clearBoard() {
	board.tiles = [];
	board.hwalls = [];
	board.vwalls = [];

	while(domBoard.firstChild) {
		domBoard.removeChild(domBoard.firstChild);
	}
}

function addTileRow(row)
	var curRow = dom.createElement("div");
	curRow.id = "row"+row;
	curRow.className = "row";
	board.appendChild(curRow);
	return curRow;
}

function addTile(column, rowindex, colindex) {
	var tile = dom.createElement("div");
	tile.className="tile";
	tile.id = "tiler"+rowindex+"c"+colindex;
	if(column.contents) {
		tile.innerHTML = column.contents;
	} else {
		tile.innerHTML = "&nbsp;";
	}
	board.appendChild(tile);
}

function addWall(wall, row, col, classNm) {
	var wall = dom.createElement("div");
	wall.className = classNm;
	wall.id = "wallr"+row+"c"+col;
	wall.innerHTML = "&nbsp;";
	board.appendChild(wall);
}

function drawBoard() {
	clearBoard();

	var sq = parseInt(domSquare.value);
	defineBoard(sq);

	for(var row=0;row<board.tiles.length;row++) {
		var curRow = addTileRow(row);

		for(var col=0;col < board.tiles[row].columns.length;col++){
			addTile(board.tiles[row].columns[col],row,col);
			if(col < board.vwalls[row].walls.length) {
				addWall(board.vwalls[row].walls[col], row, col, "hwall");
			}
		}

		if(row < board.hwalls.length) {
			for(col=0;col < board.hwalls[row].walls.length;col++) {
				addWall(board.hwalls[row].walls[col], row, col, "vwall");
			}
		}
	}

};
}
var game = new gameboard();
dom.getElementById('playButton').addEventListener("click",game.drawBoard(),false);
game.drawBoard();
