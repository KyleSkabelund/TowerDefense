MyGame.tower = (function(groundcreeps,flyingcreeps) {
    'use strict';
    function Tower(spec) {
        let ret = {
            textureTopNumber : -1,
            towerRotation: 0,
            radius: 0,
            center:{
                row: 0,
                col: 0
            },
            target:{
                row: 0,
                col: 0
            },
            ammo:{
                type:275, // number for the ammo that the turret will use.
                ammoCenter:{row:0,
                col:0}
            }
        };
        function computeAngle(rotation, ptCenter, ptTarget) {
            let v1 = {
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
        ret.addTower = function(towerNumber,center,center2){
            ret.textureTopNumber = towerNumber;
            ret.center = center;
            ret.ammo.ammoCenter = center2;
            ret.radius = 100;
        }

        ret.removeTower = function() {
            ret.textureTopNumber = -1;
        }


        ret.update = function(grid,flyingcreeps,groundcreeps, dim){
            
            for(var row = 0; row < grid.rows; ++row){
                for(var col = 0; col < grid.cols; ++col){
                    if(grid.grid[row][col].tower.textureTopNumber != -1){
                        var currentTower = grid.grid[row][col].tower;
                        var target;
                        if(getTurretType(currentTower.textureTopNumber) == "ground"){
                            target = getGroundTarget(currentTower, groundcreeps, dim);
                        }
                        else{
                            target = getAirTarget()
                        }
                        var result = computeAngle((currentTower.towerRotation),currentTower.center,target);

                            if (testTolerance(result.angle, 0, .01) === false) {
                                
                                if(result.crossProduct > 0 )
                                {
                                    currentTower.towerRotation +=  .02
                                }
                                else{
                                    currentTower.towerRotation -=  .02;
                                }
                                if(Math.abs(result.crossProduct) < .02){
                                    shoot(currentTower,target)
                                }
                                
                            }
                    }
                }
            }
        }
        function getGroundTarget(currentTurret,groundcreeps,dim){
            var groundTarget = {x:0, y:0}
            
            for(var i = 0; i < groundcreeps.creepList.length; ++i){
                if(currentTurret.center.row + currentTurret.radius   >  groundcreeps.creepList[i].graphicsRow && currentTurret.center.col - currentTurret.radius  < groundcreeps.creepList[i].graphicsCol )
                {
                    groundTarget.x= groundcreeps.creepList[i].graphicsCol+(dim.width/2);
                    groundTarget.y = groundcreeps.creepList[i].graphicsRow+topBarHeight;
                }
            }
            return groundTarget;
        }
        function getAirTarget(){

        }
        function getTurretType(turretNumber){
            if(turretNumber == 271 || turretNumber == 270)
            {
                return "air";
            }
            else{
                return "ground";
            }
        }
        function shoot(currentTurret,currentTarget){
            //compute line, draw bullet
            if(currentTarget.x != 0 || currentTarget.y != 0){
                var dx,dy;
                dx = currentTarget.x - currentTurret.ammo.ammoCenter.col;  
                dy = currentTarget.y - currentTurret.ammo.ammoCenter.row;
                currentTurret.ammo.ammoCenter.row += dy/4;
                currentTurret.ammo.ammoCenter.col += dx/4;
                if(currentTurret.ammo.ammoCenter.row == dy && currentTurret.ammo.ammoCenter.col == dx){
                    currentTurret.ammo.ammoCenter  = ret.center;
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