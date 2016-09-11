/*
Copyright 2016 Matthew Rikard

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
function gameengine() {
}

gameengine.prototype.board = {
	tiles:[],
	walls:{
		horiz:[],
		vert:[]
	}
};

function defaultGameSettings(){
	return {
		"square":20,
		"maxMoves":-1,
		"tileSize":26,
		"players":[
			{
				"image":"./images/tank.png",
				"executable":"echo \"move n\""
			}	
		],
		"frameRate":500
	}
};

var gamesettings = defaultGameSettings();

gameengine.prototype.findAllWallsOfLen = function(wallarray, walLen) {
	var output = [];
	for(var row=0;row<wallarray.length;row++) {
		for(var col=0;col<wallarray[row].walls.length;col++){
			var include = true;
			if(wallarray.type == "vert"){
				for(var t=row;t<row+walLen;t++){
					if(!wallarray[t] || !wallarray[t].walls[col] || wallarray[t].walls[col].blocked) {
						include = false;
						break;
					}
				}
			} else {
				for(var t=col;t<col+walLen;t++){
					if(!wallarray[row] || !wallarray[row].walls[t] || wallarray[row].walls[t].blocked) {
						include = false;
						break;
					}
				}
			}
			if(include) {
				output.push({prow:row,pcol:col});
			}
		}
	}
	return output;
};

gameengine.prototype.createRandomWall = function(wallarray, possibles, wallsToBuild) {
	var winner = possibles[Math.floor(Math.random()*possibles.length)];
	if(wallarray.type == "vert") {
		for(var w=winner.prow;w<winner.prow+wallsToBuild;w++){
			wallarray[w].walls[winner.pcol].blocked = true;
		}
	} else {
		for(var w=winner.pcol;w<winner.pcol+wallsToBuild;w++){
			wallarray[winner.prow].walls[w].blocked = true;
		}
	}
};

gameengine.prototype.randomWalls = function(wallarray) {
	var wallPercent = 0.2*Math.pow(wallarray.length,2);

	var walLen = 1;
	var walsBuilt = 0;
	while(walsBuilt < wallPercent) {
		var possibles = this.findAllWallsOfLen(wallarray, walLen);
		this.createRandomWall(wallarray, possibles, walLen)

		walsBuilt += walLen;
		walLen+=1;
		if(walLen > 3){
			walLen=1;
		}
	}
};


gameengine.prototype.play = function() {
	this.getRandomPlacement = function() {
		var rx = Math.floor(Math.random()*this.board.tiles.length);
		var ry = Math.floor(Math.random()*this.board.tiles.length);
		return {"row":ry,"col":rx};
	};

	this.randomPlacement = function(player){
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

	this.gameTimer = null;


	this.drawBot = function(player) {
		this.randomPlacement(player);
		var avatar = new Image();
		avatar.src = player.image;
		var ctx = gamecanvas.getContext("2d");
		var px = (gamesettings.tileSize+1) * player.col;
		var py = (gamesettings.tileSize+1) * player.row;
		ctx.drawImage(avatar,px,py,gamesettings.tileSize,gamesettings.tileSize);
	};

	this.startGame = function() {
		for(var p=0;p<gamesettings.players.length;p++){
			this.drawBot(gamesettings.players[p]);
		}
		this.gameTimer = setInterval(this.makeMoves, gamesettings.frameRate);
	};

	this.makeMoves = function() {

	}

	this.startGame();
};


gameengine.prototype.defineBoard = function(sq){
	this.board = {
		tiles:[],
		walls:{
			horiz:[],
			vert:[]
		}
	};

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
				x:(gamesettings.tileSize*c)+c+1,
				y:(gamesettings.tileSize*r)+r+1
			});
		}
	}

	//(n-1 * n)*2
	var hy=gamesettings.tileSize+2;
	var vy=1;
	for(var rn=0;rn<sq;rn++){
		this.board.walls.vert.push({type:"vert",rowid:rn,walls:[]});
		if(rn < sq-1) {
			this.board.walls.horiz.push({type:"horiz",rowid:rn,walls:[]});
		}
		var hx=1;
		var vx=gamesettings.tileSize+2;
		for(var cn=0;cn<sq;cn++) {
			if(rn < sq-1) {
				this.board.walls.horiz[rn].walls.push({
					walid:cn,
					blocked:false,
					x1:hx,
					x2:hx+gamesettings.tileSize,
					y1:hy,
					y2:hy
				});
			}
			if(cn < sq-1) {
				this.board.walls.vert[rn].walls.push({
					walid:cn,
					blocked:false,
					x1:vx,
					x2:vx,
					y1:vy,
					y2:vy+gamesettings.tileSize
				});
			}
			hx+=(gamesettings.tileSize+1);
			vx+=(gamesettings.tileSize+1);
		}
		vy+=(gamesettings.tileSize+1);
		hy+=(gamesettings.tileSize+1);		
	}

	this.randomWalls(this.board.walls.horiz);
	this.randomWalls(this.board.walls.vert);
};

gameengine.prototype.clearBoard = function() {
	this.board.tiles = [];
	this.board.walls = {horiz:[],vert:[]};
	if(this.board.maxSize){
		var ctx = gamecanvas.getContext("2d");
		ctx.clearRect(0, 0, this.board.maxSize, this.board.maxSize);
	}
};

gameengine.prototype.drawCanvas = function() {
	var ctx = gamecanvas.getContext("2d");

	ctx.fillStyle = "#cccccc";
	var maxSize = ((gamesettings.tileSize+1)*(this.board.tiles.length))+1;
	gamecanvas.width = maxSize;
	gamecanvas.height = maxSize;
	this.board.maxSize = maxSize;
	ctx.clearRect(0, 0, maxSize, maxSize);
	ctx.fillRect(0,0,maxSize,maxSize);
	
	ctx.fillStyle = "#ffffff";
	for(var r=0; r<this.board.tiles.length; r++) {
		for(var c=0;c<this.board.tiles[r].columns.length;c++){
			var cell = this.board.tiles[r].columns[c];
			ctx.fillRect(cell.x,cell.y,gamesettings.tileSize,gamesettings.tileSize);
		}
	}

	ctx.fillStyle = "#000000";

	this.drawWall(ctx, this.board.walls.horiz);
	this.drawWall(ctx, this.board.walls.vert);
};

gameengine.prototype.drawWall = function(ctx, wallarray) {
	for(var wr=0;wr<wallarray.length;wr++) {
		for(var wc=0;wc<wallarray[wr].walls.length;wc++) {
			var wall = wallarray[wr].walls[wc];
			if(wall.blocked) {
				ctx.beginPath();
				ctx.lineWidth = 3;
				ctx.moveTo(wall.x1,wall.y1);
				ctx.lineTo(wall.x2,wall.y2);
				ctx.stroke();
			}
		}
	}
}

gameengine.prototype.drawBoard = function() {
	this.clearBoard();

	var sq = gamesettings.square;
	this.defineBoard(sq);

	this.drawCanvas();
};

var game = new gameengine();
playButton.addEventListener("click",function(){
	game.clearBoard();
	game.drawBoard();
	game.play();
},false);
game.drawBoard();
