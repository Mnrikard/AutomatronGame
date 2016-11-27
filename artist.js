exports.board = {};
exports.gamesettings = {};

exports.addTiles = function(){
	for(var r=0;r<this.gamesettings.square;r++) {
		this.board.tiles.push({rowid:r,columns:[]});
		for(var c=0;c<this.gamesettings.square;c++){
			this.board.tiles[r].columns.push({
				colid:c,
				contents:null,
				x:(this.gamesettings.tileSize*c)+c+1,
				y:(this.gamesettings.tileSize*r)+r+1
			});
		}
	}
};

exports.addWallSpaces = function() {
	var hy=this.gamesettings.tileSize+2;
	var vy=1;
	for(var rn=0;rn<this.gamesettings.square;rn++){
		this.board.walls.vert.push({type:"vert",rowid:rn,walls:[]});
		if(rn < this.gamesettings.square-1) {
			this.board.walls.horiz.push({type:"horiz",rowid:rn,walls:[]});
		}
		var hx=1;
		var vx=this.gamesettings.tileSize+2;

		for(var cn=0;cn<this.gamesettings.square;cn++) {
			if(rn < this.gamesettings.square-1) {
				this.buildHorizWalls(rn, cn, hx,hy);
			}
			if(cn < this.gamesettings.square-1) {
				this.buildVertWalls(rn, cn, vx, vy);
			}
			hx+=(this.gamesettings.tileSize+1);
			vx+=(this.gamesettings.tileSize+1);
		}
		vy+=(this.gamesettings.tileSize+1);
		hy+=(this.gamesettings.tileSize+1);		
	}
};

exports.buildVertWalls = function(rn, cn, vx, vy){
	this.board.walls.vert[rn].walls.push({
		walid:cn,
		blocked:false,
		x1:vx,
		x2:vx,
		y1:vy,
		y2:vy+this.gamesettings.tileSize
	});
}

exports.buildHorizWalls = function(rn, cn, hx,hy){
	this.board.walls.horiz[rn].walls.push({
		walid:cn,
		blocked:false,
		x1:hx,
		x2:hx+this.gamesettings.tileSize,
		y1:hy,
		y2:hy
	});
};

exports.clearBoard = function() {
	this.board.tiles = [];
	this.board.walls = {horiz:[],vert:[]};
	if(this.board.maxSize){
		var ctx = gamecanvas.getContext("2d");
		ctx.clearRect(0, 0, this.board.maxSize, this.board.maxSize);
	}
};

exports.drawCanvas = function() {
	var ctx = gamecanvas.getContext("2d");

	ctx.fillStyle = "#cccccc";
	var maxSize = ((this.gamesettings.tileSize+1)*(this.board.tiles.length+1))+1;
	gamecanvas.width = maxSize;
	gamecanvas.height = maxSize;
	this.board.maxSize = maxSize;
	ctx.clearRect(0, 0, maxSize, maxSize);
	ctx.fillRect(0,0,maxSize,maxSize);
	
	ctx.fillStyle = "#ffffff";
	for(var r=0; r<this.board.tiles.length; r++) {
		for(var c=0;c<this.board.tiles[r].columns.length;c++){
			var cell = this.board.tiles[r].columns[c];
			ctx.fillRect(cell.x,cell.y,this.gamesettings.tileSize,this.gamesettings.tileSize);
		}
	}

	for(r=0;r<this.board.tiles.length;r++){
		var yp = ((this.gamesettings.tileSize+1)*r)+(this.gamesettings.tileSize/2);
		var xp = maxSize-this.gamesettings.tileSize;
		ctx.fillStyle = "#ffff00";
		ctx.fillText(r,xp,yp);

		ctx.fillText(r,yp,xp+(this.gamesettings.tileSize/2));
	}


	ctx.fillStyle = "#000000";

	this.drawWall(ctx, this.board.walls.horiz);
	this.drawWall(ctx, this.board.walls.vert);
};

exports.drawWall = function(ctx, wallarray) {
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

exports.defineBoard = function(){
	this.board = {
		tiles:[],
		walls:{
			horiz:[],
			vert:[]
		}
	};

	if(this.gamesettings.square < 1){
		alert("why you no define larger board?");
		return;
	}

	this.addTiles();
	this.addWallSpaces();

	var rando = require("./randomizer");
	rando.randomWalls(this.board.walls.horiz);
	rando.randomWalls(this.board.walls.vert);
};

exports.drawBoard = function() {
	this.clearBoard();

	this.defineBoard();

	this.drawCanvas();
	return this.board;
};

