MyGame.tower = (function() {
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
                row: 100,
                col: 100
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
            console.log(angle);
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

        ret.update = function(grid){
            for(var row = 0; row < grid.rows; ++row){
                for(var col = 0; col < grid.cols; ++col){
                    if(grid.grid[row][col].tower.towerNumber != 0)
                    {
                        var result = computeAngle(90,grid.grid[row][col].tower.center,{x:100,y:100});
                        grid.grid[row][col].tower.towerRotation = result.angle;
                    }
                }
            }

        }
    
		return ret;
    }

    return {
        Tower : Tower
	};
}());