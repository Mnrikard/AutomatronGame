	export interface position {
		row: number;
		col: number;
	}
	
	export interface wallArray {
		horiz:any[];
		vert:any[];
	}

	export interface boardStateObj {
		walls: wallArray;
		tiles: any[];
	}

	function newBoardState(){
		return {
			"walls":{"horiz":[],"vert":[]},
			"tiles":[]
		}
	}

	function getMove(movename){
		switch(movename.toLowerCase()){
			case "drive":
				return new drive();
			case "shoot":
				return new shoot();
			case "build":
				return new build();
			case "view":
				return new view();
			case "timeout":
				return new timeout();
		}
		throw "move not found:"+movename;
	}

	export class moveAction {
		boardState: boardStateObj;
		playerLocation: position;
		prepareMove(direction: string) {};
		tilesAffected: any[];
		moveOrder: number;
		currentView: boardStateObj;
		constructor(){
			this.boardState = null;
			this.playerLocation = {row:-1,col:-1};
			this.tilesAffected = [];
			this.moveOrder = -1;
		}

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

	export class drive extends moveAction {
		prepareMove(direction){
			var movespace = this.tilesUntilWall(direction);
			if(movespace.length > 1) {
				this.tilesAffected = movespace[1];
			} else {
				this.tilesAffected = movespace[0];
			}
		};
		constructor(){
			super();
			this.moveOrder=10;
		}
	}

	export class timeout extends moveAction{
		prepareMove(direction){
			alert("executable timed out (10 seconds)");
		}
		constructor(){
			super();
			this.moveOrder = 0;
		}
	}

	export class shoot extends moveAction{
		prepareMove(direction) {
			var movespace = this.tilesUntilWall(direction);
			this.tilesAffected = movespace.splice(0,1);
		}
		makeMove(direction:string) {

		}
		constructor(){
			super();
			this.moveOrder = 20;
		}
	}

	export class build extends moveAction{
		prepareMove(direction:string) {
			this.tilesAffected = [];
			if(direction.match(/^n$/i)) { this.buildWall(this.boardState.walls.horiz, this.playerLocation.row-1, this.playerLocation.col);return;}
			if(direction.match(/^s$/i)) { this.buildWall(this.boardState.walls.horiz, this.playerLocation.row, this.playerLocation.col);return;}
			if(direction.match(/^e$/i)) { this.buildWall(this.boardState.walls.vert, this.playerLocation.row, this.playerLocation.col-1);return;}
			if(direction.match(/^w$/i)) { this.buildWall(this.boardState.walls.vert, this.playerLocation.row, this.playerLocation.col);return;}
		};

		buildWall(walls:any, row:number, col:number) {
			if(walls && walls[row] && walls[row].columns[col]) {
				walls[row].columns[col].blocked = true;
			}
		};

		constructor(){
			super();
			this.moveOrder = 30;
		}
	}

	export class view extends moveAction{
		prepareMove(direction) {
			this.currentView = newBoardState();
		}
		makeMove(){}

		constructor(){
			super();
			this.moveOrder = 100;
		}
	}
