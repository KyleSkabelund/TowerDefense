MyGame.groundCreeps = (function(graphics) {
	'use strict';
	
    function GroundCreeps() {
        var ret = {
            creepList: []
        };

        ret.addCreep = function(startRow, startCol, grid, dim) {
            ret.creepList.push(GroundCreep(startRow, startCol, startRow*dim.height-topBarHeight, startCol*dim.width, grid, dim))
        }

        ret.updateCreeps = function(elapsedTime, grid, dim, pathfinder) {
            for(var ii = 0; ii < ret.creepList.length; ++ii)
            {
                ret.creepList[ii].updateCreep(elapsedTime, grid, dim, pathfinder);
            }
        }

        return ret;
    }

    function GroundCreep(startRow, startCol, graphicsStartRow, graphicsStartCol, grid, dim) {
        var ret = {
            row: startRow,    //position related to the grid
            col: startCol,
            graphicsRow: graphicsStartRow, //center position of creep related to rendering coordinates
            graphicsCol: graphicsStartCol,
            tileNumber: 245,
            speed: .05,
            stopped: true,
            rotation: 0,
            pathToEnd: [],
            end: {row: 6, col: 19}
        };

        ret.updateCreep = function(elapsedTime, grid, dim, pathfinder) {

            //if the creep is close to the middle of a square consider it stopped
            //unsure if this will be useful
            if(ret.col*dim.width - 1 <= ret.graphicsCol && ret.graphicsCol <= ret.col * dim.width + 1 
            && ret.row * dim.height - 1 <= ret.graphicsRow && ret.graphicsRow <= ret.row * dim.height + 1){
                ret.stopped = true;
            }
            else {
                ret.stopped = false;
            }

            if(ret.stopped) {
                ret.pathToEnd = pathfinder.getPath({row: ret.row, col: ret.col}, ret.end, grid);

            }

            if(ret.graphicsCol < ret.col * dim.width) {
                ret.graphicsCol += elapsedTime*ret.speed;
            }
            if(ret.graphicsCol > ret.col * dim.width) {
                ret.graphicsCol -= elapsedTime*ret.speed;
            }
            if(ret.graphicsRow < ret.row * dim.height) {
                ret.graphicsRow += elapsedTime*ret.speed;
            }
            if(ret.graphicsRow > ret.row * dim.height) {
                ret.graphicsRow -= elapsedTime*ret.speed;
            }
        }

        ret.moveLeft = function(grid) {
            //if not edge of map
            if(ret.col - 1 > 0 && ret.stopped == true) {
                ret.rotation = Math.PI;
                if(grid.grid[ret.row][ret.col - 1].tower.textureTopNumber == -1) { //if no tower continue
                    ret.col -= 1;
                }
            }
        }

        ret.moveRight = function(grid) {
            //if not edge of map
            if(ret.col + 1 < grid.cols && ret.stopped == true) {
                ret.rotation = 0;
                if(grid.grid[ret.row][ret.col + 1].tower.textureTopNumber == -1) {
                    ret.col += 1;
                }
            }
        }

        ret.moveUp = function(grid) {
            //if not edge of map
            if(ret.row - 1 > 0 && ret.stopped == true) {
                ret.rotation = 3*Math.PI/2;
                if(grid.grid[ret.row - 1][ret.col].tower.textureTopNumber == -1) {
                    ret.row -= 1;
                }
            }
        }

        ret.moveDown = function(grid) {
            //if not edge of map
            if(ret.row + 1 < grid.rows && ret.stopped == true) {
                ret.rotation = Math.PI/2;
                if(grid.grid[ret.row + 1][ret.col].tower.textureTopNumber == -1) {
                    ret.row += 1;
                }
            }
        }

        return ret;
    }
	

	return {
        GroundCreeps : GroundCreeps
	};
}(MyGame.graphics));