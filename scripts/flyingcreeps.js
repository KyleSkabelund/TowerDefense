MyGame.flyingCreeps = (function(graphics) {
	'use strict';
	
    function FlyingCreeps() {
        var ret = {
            creepList: [] //kyle on this list
        };

        ret.addCreep = function(startRow, startCol, grid, dim, topBarHeight) {
            ret.creepList.push(FlyingCreep(startRow, startCol, startRow*dim.height-topBarHeight, startCol*dim.width, grid, dim, topBarHeight))
        }

        ret.updateCreeps = function(elapsedTime, grid, dim) {
            for(var ii = 0; ii < ret.creepList.length; ++ii)
            {
                ret.creepList[ii].updateCreep(elapsedTime, grid, dim);
            }
        }

        return ret;
    }

    function FlyingCreep(startRow, startCol, graphicsStartRow, graphicsStartCol, grid, dim, topBarHeight) {
        var ret = {
            row: startRow,    //position related to the grid
            col: startCol,
            graphicsRow: graphicsStartRow, //center position of creep related to rendering coordinates
            graphicsCol: graphicsStartCol,
            tileNumber: 271,
            speed: .05,
            stopped: true,
            rotation: 0 //degrees
        };

        ret.updateCreep = function(elapsedTime, grid, dim) {

            //if the creep is close to the middle of a square consider it stopped
            //unsure if this will be useful
            if(ret.col*dim.width - 1 <= ret.graphicsCol && ret.graphicsCol <= ret.col * dim.width + 1 
            && ret.row * dim.height - 1 <= ret.graphicsRow && ret.graphicsRow <= ret.row * dim.height + 1){
                ret.stopped = true;
            }
            else {
                ret.stopped = false;
            }

            //if(ret.stopped) {
            //    ret.moveRight(grid);
            //}

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