function tile(xx,yy){
	this.x = xx;
	this.y = yy;
	this.wall = [0,0,0,0];
	this.occupied = false;
}

var gamerunner = {
	"player1":{},
	"player2":{},
	"tiles":[],
	"randomWalls":function(){
		for(var y=0;y<this["tiles"].length;y++) {
			for(var x=0;x<this["tiles"][y].length;x++) {

			}
		}
	}
};
