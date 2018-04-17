MyGame.tower = (function(groundcreeps,flyingcreeps) {
    'use strict';
    function Tower(spec) {
        let ret = {
            textureTopNumber : -1,
            towerRotation: 0,
            center:{
                row: 0,
                col: 0
            },
            target:{
                row: 0,
                col: 0
            }
        };
        function computeAngle(rotation, ptCenter, ptTarget) {
            var v1 = {
                    x : Math.cos(rotation),
                    y : Math.sin(rotation)
                },
                v2 = {
                    x : ptTarget.x - ptCenter.col,
                    y : ptTarget.y - ptCenter.row
                },
                dp,
                angle,
                cp;
            
    
            v2.len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
            v2.x /= v2.len;
            v2.y /= v2.len;
    
            dp = v1.x * v2.x + v1.y * v2.y;
            angle = Math.acos(dp);
            //
            // Get the cross product of the two vectors so we can know
            // which direction to rotate.
            cp = crossProduct2d(v1, v2);
    
            return {
                angle : angle,
                crossProduct : cp
            };
        }
        function crossProduct2d(v1, v2) {
            return (v1.x * v2.y) - (v1.y * v2.x);
        }
        ret.addTower = function(towerNumber,center){
            ret.textureTopNumber = towerNumber;
            ret.center = center;
        }

        ret.removeTower = function() {
            ret.textureTopNumber = -1;
        }

        ret.update = function(grid,flyingcreeps,groundcreeps){
            var target = {x:groundcreeps.creepList[0].graphicsCol,y:groundcreeps.creepList[0].graphicsRow};
            for(var row = 0; row < grid.rows; ++row){
                for(var col = 0; col < grid.cols; ++col){
                    if(grid.grid[row][col].tower.towerNumber != 0){
                        var result = computeAngle((grid.grid[row][col].tower.towerRotation),grid.grid[row][col].tower.center,target);
                            if (testTolerance(result.angle, 0, .01) === false) {
                                if(result.crossProduct > 0 )
                                {
                                    grid.grid[row][col].tower.towerRotation +=  6 * 3.14159 / 1000;
                                }
                                else{
                                    grid.grid[row][col].tower.towerRotation -=  6 * 3.14159 / 1000;
                                }
                            }
                    }
                }
            }
        }
        function testTolerance(value, test, tolerance) {
			if (Math.abs(value - test) < tolerance) {
				return true;
			} else {
				return false;
			}
		}
		return ret;
    }

    return {
        Tower : Tower
	};
}());