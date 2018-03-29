MyGame.init = (function(graphics) {
    'use strict';

    function Grid() {
        let ret = {
			rows: 8,
            cols: 15,
            fillstyle: 'black',
            grid: null
		}

		ret.fillGrid = function() {
            ret.grid = [];
			for(var ii = 0; ii < ret.rows; ++ii) {
                ret.grid.push([]);
                for(var jj = 0; jj < ret.cols; ++jj) {
                    ret.grid[ii].push(GridCell(ii, jj, "banana"));
                }
            }
		}

		return ret;
    }

    function GridCell(x, y, texturePath) {
        let ret = {
            x: x,
            y: y,
            texturePath: texturePath
        }

        return ret;
    }

    return {
        Grid : Grid
	};
}(MyGame.graphics));