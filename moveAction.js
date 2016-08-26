function moveAction() {
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
		var r = this.playerLocation.row;
		var c = this.playerLocation.col;

		var wr = this.playerLocation.row;
		var wc = this.playerLocation.col;

		var coldir = 0;
		var rowdir = 0;
		var walls;
		if(direction.match(/n/i)){
			rowdir-=1;
			wr -= 1;
			walls = this.boardState.walls.horiz;
		}
		if(direction.match(/s/i)){
			rowdir+=1;
			walls = this.boardState.walls.horiz;
		}
		if(direction.match(/e/i)){
			coldir+=1;
			wc -= 1;
			walls = this.boardState.walls.vert;
		}
		if(direction.match(/w/i)){
			coldir-=1;
			walls = this.boardState.walls.vert;
		}

		var output = [];

		// ha, a multidirectional loop (this maybe should be refactored, I just don't know how yet)
		while(r >= 0 && r < this.boardState.tiles.length
				&& c >=0 && c < this.boardState.tiles[r].columns.length
				&& wr >=0 && wr < walls.length 
				&& wc >=0 && wc < walls[r].columns.length 
				&& !walls[r].columns[c].blocked) {
			output.push({col:c,row:r});
			r+=rowdir;
			c+=coldir;
			wr += rowdir;
			wc += coldir;
		}
		return output;
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


















