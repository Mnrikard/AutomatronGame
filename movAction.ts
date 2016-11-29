exports.moveActions = function(){
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}
class boardStateObj {

}

	class moveAction {
		boardState: boardStateObj;
		playerLocation: {row:-1,col:-1};
		prepareMove(direction: string) {};
		tilesAffected: [];
		moveOrder: number;
		currentView: boardStateObj;
		constructor(){};
		/*
		* move = 10
		* shoot = 20
		* build = 30
		* view = 100
		*/

		tilesUntilWall(direction: string){
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
	}
	this.getMove = function(movename){
		switch(movename.toLowerCase()){
			case "drive":
				return new this.drive();
			case "shoot":
				return new this.shoot();
			case "build":
				return new this.build();
			case "view":
				return new this.view();
			case "timeout":
				return new this.timeout();
		}
		throw "move not found:"+movename;
	}

	class drive extends moveAction {
		prepareMove(direction){
			var movespace = tilesUntilWall(direction);
			if(movespace.length > 1) {
				tilesAffected = movespace[1];
			} else {
				tilesAffected = movespace[0];
			}
		};
		constructor(){
			moveOrder=10;
		}
	}

	class timeout extends moveAction{
		prepareMove(direction){
			alert("executable timed out (10 seconds)");
		}
		constructor(){
			moveOrder = 0;
		}
	}

	class shoot extends moveAction{
		prepareMove(direction) {
			var movespace = tilesUntilWall(direction);
			tilesAffected = movespace.splice(0,1);
		}
		makeMove:(direction:string) {

		}
		constructor(){
			moveOrder = 20;
		}
	}

	class build extends moveAction{
		prepareMove(direction:string) {
			this.tilesAffected = [];
			if(direction.match(/^n$/i)) { this.buildWall(this.boardState.walls.horiz, this.playerLocation.row-1, this.playerLocation.col);return;}
			if(direction.match(/^s$/i)) { this.buildWall(this.boardState.walls.horiz, this.playerLocation.row, this.playerLocation.col);return;}
			if(direction.match(/^e$/i)) { this.buildWall(this.boardState.walls.vert, this.playerLocation.row, this.playerLocation.col-1);return;}
			if(direction.match(/^w$/i)) { this.buildWall(this.boardState.walls.vert, this.playerLocation.row, this.playerLocation.col);return;}
		};

		buildWall:(walls:any, row:number, col:number) {
			if(walls && walls[row] && walls[row].columns[col]) {
				walls[row].columns[col].blocked = true;
			}
		};

		constructor(){
			moveOrder = 30;
		}
	}

	class view extends moveAction{
		prepareMove(direction) {
			this.currentView = {};
		}
		makeMove(){}

		constructor(){
			moveOrder = 100;
		}
	}
}
