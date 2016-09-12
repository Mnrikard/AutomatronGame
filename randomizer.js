exports.findAllWallsOfLen = function(wallarray, walLen) {
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

exports.createRandomWall = function(wallarray, possibles, wallsToBuild) {
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

exports.randomWalls = function(wallarray) {
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
