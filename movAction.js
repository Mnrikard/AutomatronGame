"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function newBoardState() {
    return {
        "walls": { "horiz": [], "vert": [] },
        "tiles": []
    };
}
function getMove(movename) {
    switch (movename.toLowerCase()) {
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
    throw "move not found:" + movename;
}
var moveAction = (function () {
    function moveAction() {
        this.boardState = null;
        this.playerLocation = { row: -1, col: -1 };
        this.tilesAffected = [];
        this.moveOrder = -1;
    }
    moveAction.prototype.prepareMove = function (direction) { };
    ;
    moveAction.prototype.tilesUntilWall = function (direction) {
        var tilerow = this.playerLocation.row;
        var tilecol = this.playerLocation.col;
        var wallRow = this.playerLocation.row;
        var wallColumn = this.playerLocation.col;
        var coldir = 0;
        var rowdir = 0;
        var walls;
        if (direction.match(/n/i)) {
            rowdir -= 1;
            wallRow -= 1;
            walls = this.boardState.walls.horiz;
        }
        if (direction.match(/s/i)) {
            rowdir += 1;
            walls = this.boardState.walls.horiz;
        }
        if (direction.match(/e/i)) {
            coldir += 1;
            wallColumn -= 1;
            walls = this.boardState.walls.vert;
        }
        if (direction.match(/w/i)) {
            coldir -= 1;
            walls = this.boardState.walls.vert;
        }
        var output = [];
        // ha, a multidirectional loop (this maybe should be refactored, I just don't know how yet)
        while (tilerow >= 0 && tilerow < this.boardState.tiles.length
            && tilecol >= 0 && tilecol < this.boardState.tiles[tilerow].columns.length
            && wallRow >= 0 && wallRow < walls.length
            && wallColumn >= 0 && wallColumn < walls[tilerow].columns.length
            && !walls[tilerow].columns[tilecol].blocked) {
            output.push({ col: tilecol, row: tilerow });
            tilerow += rowdir;
            tilecol += coldir;
            wallRow += rowdir;
            wallColumn += coldir;
        }
        return output;
    };
    return moveAction;
}());
exports.moveAction = moveAction;
var drive = (function (_super) {
    __extends(drive, _super);
    function drive() {
        _super.call(this);
        this.moveOrder = 10;
    }
    drive.prototype.prepareMove = function (direction) {
        var movespace = this.tilesUntilWall(direction);
        if (movespace.length > 1) {
            this.tilesAffected = movespace[1];
        }
        else {
            this.tilesAffected = movespace[0];
        }
    };
    ;
    return drive;
}(moveAction));
exports.drive = drive;
var timeout = (function (_super) {
    __extends(timeout, _super);
    function timeout() {
        _super.call(this);
        this.moveOrder = 0;
    }
    timeout.prototype.prepareMove = function (direction) {
        alert("executable timed out (10 seconds)");
    };
    return timeout;
}(moveAction));
exports.timeout = timeout;
var shoot = (function (_super) {
    __extends(shoot, _super);
    function shoot() {
        _super.call(this);
        this.moveOrder = 20;
    }
    shoot.prototype.prepareMove = function (direction) {
        var movespace = this.tilesUntilWall(direction);
        this.tilesAffected = movespace.splice(0, 1);
    };
    shoot.prototype.makeMove = function (direction) {
    };
    return shoot;
}(moveAction));
exports.shoot = shoot;
var build = (function (_super) {
    __extends(build, _super);
    function build() {
        _super.call(this);
        this.moveOrder = 30;
    }
    build.prototype.prepareMove = function (direction) {
        this.tilesAffected = [];
        if (direction.match(/^n$/i)) {
            this.buildWall(this.boardState.walls.horiz, this.playerLocation.row - 1, this.playerLocation.col);
            return;
        }
        if (direction.match(/^s$/i)) {
            this.buildWall(this.boardState.walls.horiz, this.playerLocation.row, this.playerLocation.col);
            return;
        }
        if (direction.match(/^e$/i)) {
            this.buildWall(this.boardState.walls.vert, this.playerLocation.row, this.playerLocation.col - 1);
            return;
        }
        if (direction.match(/^w$/i)) {
            this.buildWall(this.boardState.walls.vert, this.playerLocation.row, this.playerLocation.col);
            return;
        }
    };
    ;
    build.prototype.buildWall = function (walls, row, col) {
        if (walls && walls[row] && walls[row].columns[col]) {
            walls[row].columns[col].blocked = true;
        }
    };
    ;
    return build;
}(moveAction));
exports.build = build;
var view = (function (_super) {
    __extends(view, _super);
    function view() {
        _super.call(this);
        this.moveOrder = 100;
    }
    view.prototype.prepareMove = function (direction) {
        this.currentView = newBoardState();
    };
    view.prototype.makeMove = function () { };
    return view;
}(moveAction));
exports.view = view;
