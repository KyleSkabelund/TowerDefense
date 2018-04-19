MyGame.flyingCreeps = (function(graphics) {
	'use strict';
	
    function FlyingCreeps() {
        var ret = {
            creepList: [] //kyle on this list
        };

        ret.addCreep = function(startRow, startCol, ending, grid, dim) {
            if(startCol == -1) ret.creepList.push(FlyingCreep(startRow, startCol, ending, startRow*dim.height-topBarHeight, startCol*dim.width, grid, dim, 0))
            if(startRow == -1) ret.creepList.push(FlyingCreep(startRow, startCol, ending, startRow*dim.height-topBarHeight, startCol*dim.width, grid, dim, Math.PI/2))
        }

        ret.updateCreeps = function(elapsedTime, grid, dim) {
            let keepList = [];
            var tolerance = 2;
            for(var ii = 0; ii < ret.creepList.length; ++ii)
            {
                let keepCreep = true;
                //creep has reached the end
                if(ret.creepList[ii].ending.col*dim.width - tolerance <= ret.creepList[ii].graphicsCol 
                    && ret.creepList[ii].graphicsCol <= ret.creepList[ii].ending.col * dim.width + tolerance 
                    && ret.creepList[ii].ending.row * dim.height - tolerance <= ret.creepList[ii].graphicsRow 
                    && ret.creepList[ii].graphicsRow <= ret.creepList[ii].ending.row * dim.height + tolerance) {
                        keepCreep = false;
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

        ret.resizeCanvas = function(dim) {
            for(var i in ret.creepList) {
                ret.creepList[i].graphicsRow = dim.height * ret.creepList[i].row;
                ret.creepList[i].graphicsCol = dim.width * ret.creepList[i].col;
            }
        }

        return ret;
    }

    function FlyingCreep(startRow, startCol, ending, graphicsStartRow, graphicsStartCol, grid, dim, rotation) {
        var ret = {
            row: startRow,    //position related to the grid
            col: startCol,
            graphicsRow: graphicsStartRow, //center position of creep related to rendering coordinates
            graphicsCol: graphicsStartCol,
            tileNumber: 301,
            speed: .05,
            stopped: true,
            rotation: rotation, //degrees
            ending: ending,
            hitPointsPercentage: 100,
            spriteCount: 6, //frames
            currentSprite: 0, //current frame
            animationTime: 200, //milliseconds per frame
            currentAnimationTime: 200
        };

        ret.updateCreep = function(elapsedTime, grid, dim) {

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
                if(ret.col < ending.col) {
                    ret.moveRight(grid);
                }
                if(ret.row < ending.row) {
                    ret.moveDown(grid);
                }
            }

            if(!ret.stopped) {
                if(ret.currentAnimationTime <= 0) {
                    ++ret.currentSprite;
                    if(ret.currentSprite == ret.spriteCount) {
                        ret.currentSprite = 0;
                    }
                    ret.currentAnimationTime = ret.animationTime;
                } else {
                    ret.currentAnimationTime -= elapsedTime;
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

        ret.moveLeft = function(grid) {
            //if not edge of map
            if(ret.col - 1 > 0 && ret.stopped == true) {
                ret.col -= 1;
                ret.rotation = Math.PI;
            }
        }

        ret.moveRight = function(grid) {
            //if not edge of map
            if(ret.col + 1 < grid.cols && ret.stopped == true) {
                ret.col += 1;
                ret.rotation = 0;
            }
        }

        ret.moveUp = function(grid) {
            //if not edge of map
            if(ret.row - 1 > 0 && ret.stopped == true) {
                ret.row -= 1;
                ret.rotation = 3*Math.PI/2;
            }
        }

        ret.moveDown = function(grid) {
            //if not edge of map
            if(ret.row + 1 < grid.rows && ret.stopped == true) {
                ret.row += 1;
                ret.rotation = Math.PI/2;
            }
        }

        return ret;
    }
	

	return {
        FlyingCreeps : FlyingCreeps
	};
}(MyGame.graphics));