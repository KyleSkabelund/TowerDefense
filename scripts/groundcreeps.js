MyGame.groundCreeps = (function(graphics) {
	'use strict';
	
    function GroundCreeps() {
        var ret = {
            creepList: []
        };

        ret.addCreep = function(startRow, startCol, endings, grid, dim) {
            ret.creepList.push(GroundCreep(startRow, startCol, endings, startRow*dim.height-topBarHeight, startCol*dim.width, grid, dim))
        }

        ret.updateCreeps = function(elapsedTime, grid, dim, pathfinder, refreshPaths) {
            let keepList = [];
            var tolerance = 2;
            for(var ii = 0; ii < ret.creepList.length; ++ii)
            {
                let keepCreep = true;
                for(var jj = 0; jj < ret.creepList[ii].endings.length; ++jj)
                {
                    //creep has reached the end
                    if(ret.creepList[ii].endings[jj].col*dim.width - tolerance <= ret.creepList[ii].graphicsCol 
                        && ret.creepList[ii].graphicsCol <= ret.creepList[ii].endings[jj].col * dim.width + tolerance 
                        && ret.creepList[ii].endings[jj].row * dim.height - tolerance <= ret.creepList[ii].graphicsRow 
                        && ret.creepList[ii].graphicsRow <= ret.creepList[ii].endings[jj].row * dim.height + tolerance) {
                            keepCreep = false;
                        }
                }
                if(ret.creepList[ii].hitPointsPercentage <= 0) {
                    keepCreep = false;
                }
                if(keepCreep == true) {
                    ret.creepList[ii].updateCreep(elapsedTime, grid, dim, pathfinder, refreshPaths);
                    keepList.push(ret.creepList[ii]);
                }
            }
            ret.creepList = keepList;
        }

        ret.creepInSquare = function(row, col) {
            for(var ii = 0; ii < ret.creepList.length; ++ii) {
                if(ret.creepList[ii].row == row && ret.creepList[ii].col == col) {
                    return true;
                }
            }   
            return false;
        }

        ret.resizeCanvas = function(dim) {
            for(var i in ret.creepList) {
                ret.creepList[i].graphicsRow = dim.height * ret.creepList[i].row;
                ret.creepList[i].graphicsCol = dim.width * ret.creepList[i].col;
            }
        }

        return ret;
    }

    function GroundCreep(startRow, startCol, endings, graphicsStartRow, graphicsStartCol, grid, dim) {
        var ret = {
            row: startRow,    //position related to the grid
            col: startCol,
            graphicsRow: graphicsStartRow, //center position of creep related to rendering coordinates
            graphicsCol: graphicsStartCol,
            tileNumber: 245,
            speed: .05,
            stopped: true,
            rotation: 0,
            rotationSpeed: Math.PI/100,
            pathToEnd: [],
            endings: endings,
            hitPointsPercentage: 100
        };

        ret.updateCreep = function(elapsedTime, grid, dim, pathfinder, refreshPaths) {
            //subject to change allows creeps to spawn off the grid
            if(ret.col == -1) {
                ret.col = 0;
            }

            if(refreshPaths == true || ret.pathToEnd.length == 0) {
                ret.pathToEnd = getShortestPathToEnd(endings, grid, pathfinder);
            }
            //if the creep is close to the middle of a square consider it stopped
            //unsure if this will be useful
            var tolerance = 2;
            if(ret.col*dim.width - tolerance <= ret.graphicsCol && ret.graphicsCol <= ret.col * dim.width + tolerance 
            && ret.row * dim.height - tolerance <= ret.graphicsRow && ret.graphicsRow <= ret.row * dim.height + tolerance){
                ret.stopped = true;
            }
            else {
                ret.stopped = false;
            }

            if(ret.stopped) {
                var nextMove = getNextMove(ret.pathToEnd);
                
                if(nextMove != undefined) {
                    if(nextMove.row > ret.row) ret.moveDown(grid);
                    if(nextMove.row < ret.row) ret.moveUp(grid);
                    if(nextMove.col < ret.col) ret.moveLeft(grid);
                    if(nextMove.col > ret.col) ret.moveRight(grid);
                }
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

        function getNextMove(path) {
            for(var ii = 0; ii < path.length; ++ii) {
                if(path[ii].col == ret.col && path[ii].row == ret.row) {
                    return path[ii-1];
                }
            }
        }

        function getShortestPathToEnd(endings, grid, pathfinder) {
            var shortest = null;
            for(var ii = 0; ii < endings.length; ++ii) {
                var tmpPath = pathfinder.getPath({row: ret.row, col: ret.col}, endings[ii], grid);
                if(tmpPath != null) {
                    if(shortest == null || shortest.length > tmpPath.length) {
                        shortest = tmpPath;
                    }
                }
            }
            return shortest;
        }

        //if creep is facing the desired direction return true
        /*
        if creep is not facing the desired direction increment in the right direction 
        and return false indicating the creep should not move to adjacent cell
        */
        function doRotation(desired) { 
            if(!(desired - ret.rotationSpeed <= ret.rotation && ret.rotation <= desired + ret.rotationSpeed)) {
                
                ret.rotation += rotationDecision(desired);

                if(ret.rotation > 2*Math.PI) {
                    ret.rotation -= 2*Math.PI;
                    return false;
                }
                if(ret.rotation < 0) {
                    ret.rotation += 2*Math.PI;
                    return false;
                }
                return false;
            }
            ret.rotation = desired;
            return true;
        }

        function rotationDecision(desired) {
            if(desired == 0) {
                if(0 < ret.rotation && ret.rotation <= Math.PI)
                    return -ret.rotationSpeed;
                else
                    return ret.rotationSpeed;
            }
            else if(desired == Math.PI/2) {
                if(Math.PI/2 < ret.rotation && ret.rotation <= 3*Math.PI/2)
                    return -ret.rotationSpeed;
                else
                    return ret.rotationSpeed;
            }
            else if(desired == Math.PI) {
                if(Math.PI < ret.rotation && ret.rotation <= 2*Math.PI)
                    return -ret.rotationSpeed;
                else
                    return ret.rotationSpeed;
            }
            else if(desired == 3*Math.PI/2) {
                if(Math.PI/2 <= ret.rotation && ret.rotation < 3*Math.PI/2)
                    return ret.rotationSpeed;
                else
                    return -ret.rotationSpeed;
            }
        }

        ret.moveLeft = function(grid) {
            //if not edge of map
            if(ret.col - 1 >= 0 && ret.stopped == true) {
                if(!doRotation(Math.PI)) return;
                if(grid.grid[ret.row][ret.col - 1].tower.textureTopNumber == -1) { //if no tower continue
                    ret.col -= 1;
                }
            }
        }

        ret.moveRight = function(grid) {
            //if not edge of map
            if(ret.col + 1 < grid.cols && ret.stopped == true) {
                if(!doRotation(0)) return;
                if(grid.grid[ret.row][ret.col + 1].tower.textureTopNumber == -1) {
                    ret.col += 1;
                }
            }
        }

        ret.moveUp = function(grid) {
            //if not edge of map
            if(ret.row - 1 >= 0 && ret.stopped == true) {
                if(!doRotation(3*Math.PI/2)) return;
                if(grid.grid[ret.row - 1][ret.col].tower.textureTopNumber == -1) {
                    ret.row -= 1;
                }
            }
        }

        ret.moveDown = function(grid) {
            //if not edge of map
            if(ret.row + 1 < grid.rows && ret.stopped == true) {
                if(!doRotation(Math.PI/2)) return;
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