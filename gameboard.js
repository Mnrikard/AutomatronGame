
var board = function(){
	var tile = function(xx,yy){
		this.x=0;
		this.y=0;
		this.wallTop=false;
		this.wallLeft=false;
		this.wallRight=false;
		this.wallBottom=false;
		this.draw = function() {
			var span = document.createElement("span");
			span.className = "tile";
			span.id="row"+yy+"col"+xx;
			return span;
		};
	};

	var draw = function(){
		var board = document.getElementById('gameboard');
		var sq = parseInt(document.getElementById('square').value);
		for(var y=0;y<sq;y++){
			var row = document.createElement("div");
			row.id = "row"+y;
			board.appendChild(row);
			for(var x=0;x<sq;x++) {
				var space = new tile(x,y);
				row.appendChild(space.draw());
			}
		}
	};
};

var b = new board();
document.getElementById('playButton').addEventListener("click",b.draw,false);
b.draw();

