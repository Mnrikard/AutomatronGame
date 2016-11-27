exports.moveAction = function() {
	this.boardState = null;
	this.playerLocation = {row:-1,col:-1};
	this.prepareMove = function(direction) {};
	this.tilesAffected = [];
	this.moveOrder = -1;
	this.currentView = null;
	/*
	* move = 10
	* shoot = 20
	* build = 30
	* view = 100
	*/

	this.tilesUntilWall(direction){
		var tilerow = this.playerLocation.row;
		var tilecol = this.playerLocation.col;
		var wallRow = this.playerLocation.row;
		var wallColumn = this.playerLocation.col;
		var coldir = 0;
		var rowdir = 0;
		var walls;

		if(direction.match(/n/i)){
			rowdir-=1;
			wallRow -= 1;
			walls = this.boardState.walls.horiz;
		}

		if(direction.match(/s/i)){
			rowdir+=1;
			walls = this.boardState.walls.horiz;
		}

		if(direction.match(/e/i)){
			coldir+=1;
			wallColumn -= 1;
			walls = this.boardState.walls.vert;
		}

		if(direction.match(/w/i)){
			coldir-=1;
			walls = this.boardState.walls.vert;
		}

		var output = [];

		// ha, a multidirectional loop (this maybe should be refactored, I just don't know how yet)
		while(tilerow >= 0 && tilerow < this.boardState.tiles.length
				&& tilecol >=0 && tilecol < this.boardState.tiles[tilerow].columns.length
				&& wallRow >=0 && wallRow < walls.length
				&& wallColumn >=0 && wallColumn < walls[tilerow].columns.length
				&& !walls[tilerow].columns[tilecol].blocked) {
			output.push({col:tilecol,row:tilerow});
			tilerow += rowdir;
			tilecol += coldir;
			wallRow += rowdir;
			wallColumn += coldir;
		}
		return output;
	}

	this.getMove(movename){
		switch(movename.toLower()){
			case "drive":
				return new drive();
			case "shoot":
				return new shoot();
			case "build":
				return new build();
			case "view":
				return new view();
		}
		throw new exception("move not found "+movename);
	}
}

function drive() {
	moveAction.call(this);
	this.prepareMove = function(direction){
		var movespace = this.tilesUntilWall(direction);
		if(movespace.length > 1) {
			this.tilesAffected = movespace[1];
		} else {
			this.tilesAffected = movespace[0];
		}
	};
	this.moveOrder = 10;
}

function shoot() {
	moveAction.call(this);
	this.prepareMove = function(direction) {
		var movespace = this.tilesUntilWall(direction);
		this.tilesAffected = movespace.splice(0,1);
	};
	this.makeMove = function(direction) {

	}
	this.moveOrder = 20;
}

function build() {
	moveAction.call(this);
	this.prepareMove = function(direction) {
		this.tilesAffected = [];
		if(direction.match(/^n$/i)) { this.buildWall(this.boardState.walls.horiz, this.playerLocation.row-1, this.playerLocation.col);return;}
		if(direction.match(/^s$/i)) { this.buildWall(this.boardState.walls.horiz, this.playerLocation.row, this.playerLocation.col);return;}
		if(direction.match(/^e$/i)) { this.buildWall(this.boardState.walls.vert, this.playerLocation.row, this.playerLocation.col-1);return;}
		if(direction.match(/^w$/i)) { this.buildWall(this.boardState.walls.vert, this.playerLocation.row, this.playerLocation.col);return;}
	};

	this.buildWall = function(walls, row, col) {
		if(walls && walls[row] && walls[row].columns[col]) {
			walls[row].columns[col].blocked = true;
		}
	};

	this.moveOrder = 30;
}

function view() {
	moveAction.call(this);
	this.prepareMove = function(direction) {
		this.currentView = {};
	};
	this.makeMove = function(){};

	this.moveOrder = 100;
}

