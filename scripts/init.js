MyGame.init = (function(graphics, tower) {
    'use strict';

    function Grid() {
        let ret = {
			rows: 10,
            cols: 20,
            fillstyle: 'red',
            grid: null,
            totalTowers: 0
        }
        
        var oldx = 0,
            oldy= 0 ;

		ret.fillGrid = function() {
            ret.grid = [];
			for(var ii = 0; ii < ret.rows; ++ii) {
                ret.grid.push([]);
                for(var jj = 0; jj < ret.cols; ++jj) {
                    ret.grid[ii].push(GridCell(ii, jj));
                }
            }
		}

        ret.allocateMapNumbers = function(map) {
            var ii = 0;
            var jj = 0;

            for(var i = 0; i < map.length;) {
                if(jj < ret.cols) {
                    ret.grid[ii][jj].tileNumber = map[i];
                    ++jj;
                    ++i;
                }
                else {
                    jj = 0;
                    ++ii;
                }
            }
        }

        ret.placeTower = function(mouseX, mouseY, cellDimensions, towerNumber) {
            //dont place if top bar is clicked
            
            if(mouseY <= topBarHeight) return;
            
            mouseY -= topBarHeight; //compensate for the top bar
            
            //get the array index of where the mouse was clicked
            let gridRow = Math.floor(mouseY / cellDimensions.height);
            let gridCol = Math.floor(mouseX / cellDimensions.width);
            let center = {
                row:(gridRow*cellDimensions.height) + cellDimensions.height/2 +25,
                col:(gridCol*cellDimensions.width) + cellDimensions.width/2
            }

            let center2 = {
                row:(gridRow*cellDimensions.height) + cellDimensions.height/2 + 25,
                col:(gridCol*cellDimensions.width) + cellDimensions.width/2
            }

            ret.grid[gridRow][gridCol].tower.addTower(
                towerNumber,
                center,
                center2,
                cellDimensions
            );
            ++ret.totalTowers;
        }

        //in tower.js
        /*ret.removeTower = function(row, col) {
            if(row != undefined && col != undefined) {
                ret.grid[row][col].tower.removeTower();
            }
            --ret.totalTowers;
        }*/
        
        ret.hasTower = function(row, col) {
            if(ret.grid[row][col].tower.textureTopNumber == -1) return false;
            return true;
        }

		return ret;
    }

    function GridCell(row, col) {
        let ret = {
            row: row,
            col: col,
            tileNumber: -1, //number associated with what tile will be rendered in this cell,
            tower: tower.Tower({center:{x:-1,y:-1}, towerRotation:0}), //will hold tower object  
        }

        return ret;
    }

    return {
        Grid : Grid,
	};
}(MyGame.graphics, MyGame.tower));