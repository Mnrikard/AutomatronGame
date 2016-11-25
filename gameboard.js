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
	this.artist = require('./boardBuilder');
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
				"executable":"echo \"{action:'move',direction='n'}\""
				"input":"standardinput"//file, http
			}	
		],
		"frameRate":5000
	}
};

var gamesettings = defaultGameSettings();


var game = new gameengine();
game.artist.board = game.board;
game.artist.gamesettings = gamesettings;

playButton.addEventListener("click",function(){
	game.artist.clearBoard();
	game.board = game.artist.drawBoard();
	game.play.startGame(game.board, gamesettings);
},false);
game.artist.drawBoard();
