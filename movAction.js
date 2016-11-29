var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
exports.moveActions = function () {
    var Animal = (function () {
        function Animal(theName) {
            this.name = theName;
        }
        Animal.prototype.move = function (distanceInMeters) {
            if (distanceInMeters === void 0) { distanceInMeters = 0; }
            console.log(this.name + " moved " + distanceInMeters + "m.");
        };
        return Animal;
    }());
    var Snake = (function (_super) {
        __extends(Snake, _super);
        function Snake(name) {
            _super.call(this, name);
        }
        Snake.prototype.move = function (distanceInMeters) {
            if (distanceInMeters === void 0) { distanceInMeters = 5; }
            console.log("Slithering...");
            _super.prototype.move.call(this, distanceInMeters);
        };
        return Snake;
    }(Animal));
    var boardStateObj = (function () {
        function boardStateObj() {
        }
        return boardStateObj;
    }());
    var moveAction = (function () {
        function moveAction() {
        }
        moveAction.prototype.prepareMove = function (direction) { };
        ;
        ;
        /*
        * move = 10
        * shoot = 20
        * build = 30
        * view = 100
        */
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
    this.getMove = function (movename) {
        switch (movename.toLowerCase()) {
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
        throw "move not found:" + movename;
    };
    var drive = (function (_super) {
        __extends(drive, _super);
        function drive() {
            moveOrder = 10;
        }
        drive.prototype.prepareMove = function (direction) {
            var movespace = tilesUntilWall(direction);
            if (movespace.length > 1) {
                tilesAffected = movespace[1];
            }
            else {
                tilesAffected = movespace[0];
            }
        };
        ;
        return drive;
    }(moveAction));
    var timeout = (function (_super) {
        __extends(timeout, _super);
        function timeout() {
            moveOrder = 0;
        }
        timeout.prototype.prepareMove = function (direction) {
            alert("executable timed out (10 seconds)");
        };
        return timeout;
    }(moveAction));
    var shoot = (function (_super) {
        __extends(shoot, _super);
        function shoot() {
            moveOrder = 20;
        }
        shoot.prototype.prepareMove = function (direction) {
            var movespace = tilesUntilWall(direction);
            tilesAffected = movespace.splice(0, 1);
        };
        return shoot;
    }(moveAction));
    var build = (function (_super) {
        __extends(build, _super);
        function build() {
            _super.apply(this, arguments);
            this.buildWall = {
                walls: [row].columns[col].blocked = true
            };
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
        return build;
    }(moveAction));
    ;
    constructor();
    {
        moveOrder = 30;
    }
};
var view = (function (_super) {
    __extends(view, _super);
    function view() {
        moveOrder = 100;
    }
    view.prototype.prepareMove = function (direction) {
        this.currentView = {};
    };
    view.prototype.makeMove = function () { };
    return view;
}(moveAction));
