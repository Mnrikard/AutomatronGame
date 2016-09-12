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
	this.play = require('./gameplay');
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


gameengine.prototype.addTiles = function(){
	for(var r=0;r<gamesettings.square;r++) {
		this.board.tiles.push({rowid:r,columns:[]});
		for(var c=0;c<gamesettings.square;c++){
			this.board.tiles[r].columns.push({
				colid:c,
				contents:null,
				x:(gamesettings.tileSize*c)+c+1,
				y:(gamesettings.tileSize*r)+r+1
			});
		}
	}
};

gameengine.prototype.addWallSpaces = function() {
	var hy=gamesettings.tileSize+2;
	var vy=1;
	for(var rn=0;rn<gamesettings.square;rn++){
		this.board.walls.vert.push({type:"vert",rowid:rn,walls:[]});
		if(rn < gamesettings.square-1) {
			this.board.walls.horiz.push({type:"horiz",rowid:rn,walls:[]});
		}
		var hx=1;
		var vx=gamesettings.tileSize+2;
		for(var cn=0;cn<gamesettings.square;cn++) {
			if(rn < gamesettings.square-1) {
				this.board.walls.horiz[rn].walls.push({
					walid:cn,
					blocked:false,
					x1:hx,
					x2:hx+gamesettings.tileSize,
					y1:hy,
					y2:hy
				});
			}
			if(cn < gamesettings.square-1) {
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
};

gameengine.prototype.defineBoard = function(){
	this.board = {
		tiles:[],
		walls:{
			horiz:[],
			vert:[]
		}
	};

	if(gamesettings.square < 1){
		alert("why you no define larger board?");
		return;
	}

	this.addTiles();
	this.addWallSpaces();

	var rando = require("./randomizer");
	rando.randomWalls(this.board.walls.horiz);
	rando.randomWalls(this.board.walls.vert);
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

	this.defineBoard();

	this.drawCanvas();
};

var game = new gameengine();
playButton.addEventListener("click",function(){
	game.clearBoard();
	game.drawBoard();
	game.play.startGame(game.board, gamesettings);
},false);
game.drawBoard();
