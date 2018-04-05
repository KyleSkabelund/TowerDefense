MyGame.init = (function(graphics, tower) {
    'use strict';

    function Grid() {
        let ret = {
			rows: 10,
            cols: 20,
            fillstyle: 'red',
            grid: null
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
                let gridY = Math.floor(mouseX / cellDimensions.width);
                let gridX = Math.floor(mouseY / cellDimensions.height);

                ret.grid[gridX][gridY].tower.addTower(towerNumber);
        }

		return ret;
    }

    function GridCell(x, y,selected) {
        let ret = {
            x: x,
            y: y,
            tileNumber: -1, //number associated with what tile will be rendered in this cell,
            tower: tower.Tower(), //will hold tower object  
        }

        return ret;
    }

    return {
        Grid : Grid,
	};
}(MyGame.graphics, MyGame.tower));