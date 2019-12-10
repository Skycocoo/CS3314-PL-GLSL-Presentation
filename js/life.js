// Created by Yuxi Luo; June 2018
/*jshint esversion: 6 */

var life = {
    board: undefined,
    boardPos: undefined,
    cube: Cube,

    width: 100,
    height: 50,
    depth: 1,

    init: function() {
        this.initBoard();
        this.getBoardPos();
        this.cube.initBuffer();
        // console.log(this.sumBoard(this.board));
    },
    initBoard: function() {
        this.board = new Array(this.width);
        for (var i = 0; i < this.width; i++) {
            this.board[i] = new Array(this.height);
            for (var j = 0; j < this.height; j++) {
                this.board[i][j] = new Array(this.depth);
                for (var k = 0; k < this.depth; k++) {
                    // value: 0 or 1
                    this.board[i][j][k] = Math.floor(Math.random() * 2);
                }
            }
        }
        // console.log(this.board);
    },
    getBoardPos: function() {
        this.boardPos = [];

        var offWidth = (this.width - 1) / 2,
            offHeight = (this.height - 1) / 2,
            offDepth = (this.depth - 1) / 2;

        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                for (var k = 0; k < this.board[i][j].length; k++) {
                    if (this.board[i][j][k] != 0) {
                        this.boardPos.push((i - offWidth)/3, (j - offHeight)/3, (k - offDepth)/3);
                    }
                }
            }
        }
        // console.log(this.boardPos);
    },
    countNeighbor: function(x, y, z) {
        var result = 0;
            // posX = 0,
            // posY = 0,
            // posZ = 0;
        for (var i = x - 1; i <= x + 1; i++) {
            if (i < 0 || i >= this.width) continue;
            // posX = (i < 0) ? (this.width - 1) : ((i >= this.width) ? 0 : i); // if wrap around

            for (var j = y - 1; j <= y + 1; j++) {
                if (j < 0 || j >= this.height) continue;
                // posY = (j < 0) ? (this.height - 1) : ((j >= this.height) ? 0 : j); // if wrap around

                for (var k = z - 1; k <= z + 1; k++) {
                    if (k < 0 || k >= this.depth) continue;
                    // posZ = (k < 0) ? (this.depth - 1) : ((k >= this.depth) ? 0 : k); // if wrap around
                    // result += this.board[posX][posY][posZ];
                    if (i == x && j == y && k == z) continue;
                    result += this.board[i][j][k];
                }
            }
        }
        return result;
    },
    gameOfLife: function() {
        // Bays, Carter. "Candidates for the Game of Life in Three Dimensions." Complex Systems1 (1987)
        // Life(5766) is the best combinations in 3D that are analogous to Conway's Game of Life in 2D

        // initialize new board with 0s
        var neighbors = new Array(this.width);

        for (var i = 0; i < this.width; i++) {
            neighbors[i] = new Array(this.height);
            for (var j = 0; j < this.height; j++) {
                neighbors[i][j] = new Array(this.depth);
                for (var k = 0; k < this.depth; k++) {
                    neighbors[i][j][k] = 0;
                }
            }
        }

        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                for (var k = 0; k < this.depth; k++) {
                    neighbors[i][j][k] = this.countNeighbor(i, j, k);
                }
            }
        }

        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                for (var k = 0; k < this.depth; k++) {
                    if (this.board[i][j][k] == 1) {
                        // if (!(neighbors[i][j][k] >= 5 && neighbors[i][j][k] <= 7)) {
                        if (!(neighbors[i][j][k] == 2 || neighbors[i][j][k] == 3)) {
                            this.board[i][j][k] = 0;
                        }
                    } else {
                        if (neighbors[i][j][k] == 3) {
                            this.board[i][j][k] = 1;
                        }
                    }
                }
            }
        }
    },
    update: function(deltaTime) {
        this.cube.updateElapsed(deltaTime);
        if (this.sumBoard(this.board) == 0) {
            this.initBoard();
            this.getBoardPos();
        }
    },
    render: function(shaderProgram) {
        // console.log(this.board);
        for (var i = 0; i < this.boardPos.length / 3; i++) {
            this.cube.update([this.boardPos[3 * i], this.boardPos[3 * i + 1], this.boardPos[3 * i + 2]]);
            this.cube.render(shaderProgram);
        }
    },
    sumBoard: function(array) {
        // https://stackoverflow.com/a/48342922/8127729
        return array.reduce((sum, cur) => sum + (Array.isArray(cur) ? this.sumBoard(cur) : cur), 0);
    }
};

// function clamp(val, srcMin, srcMax, targMin, targMax) {
//     result = targMin + (val - srcMin) / (srcMax - srcMin) * (targMax - targMin);
//     return (result < targMin) ? targMin : (result > targMax) ? targMax : result;
// }
