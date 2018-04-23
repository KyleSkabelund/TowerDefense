MyGame.tower = (function(graphics) {
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
                type:0, // number for the ammo that the turret will use.
                ammoCenter:{row:0,
                col:0}
            },
            creepListTarget: null
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
        ret.addTower = function(towerNumber,center,center2,dim){
            ret.textureTopNumber = towerNumber;
            ret.center = center;
            ret.ammo.ammoCenter = center2;
            if(towerNumber == 249 || towerNumber == 250 ){
                ret.ammo.type = 251;
            }
            else{
                ret.ammo.type = 275;
            }
            ret.radius = 350;
        }
        ret.upgradeTower = function(grid,row,col){
            if(grid.grid[row][col].tower.textureTopNumber != -1){
                var newTowerNumber = grid.grid[row][col].tower.textureTopNumber;
                switch(grid.grid[row][col].tower.textureTopNumber){
                case 291:
                    newTowerNumber = 303;
                    break;
                case 303:
                    newTowerNumber = 304;
                    break;
                case 292:
                    newTowerNumber = 250;
                    break;
                case 249:
                    newTowerNumber = 305;
                    break;
                case 307:
                    newTowerNumber = 250;
                    break;
                }
                if(grid.grid[row][col].tower.textureTopNumber = newTowerNumber){
                    return false;
                }
                else{
                    grid.grid[row][col].tower.textureTopNumber = newTowerNumber
                    return true;
                }
            }
        }

        ret.removeTower = function(grid,row,col) {
            grid.grid[row][col].tower.textureTopNumber = -1;
        }


        ret.update = function(grid,flyingcreeps,groundcreeps, dim, sounds){
            
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
                            //console.log(result.angle)
                            if (testTolerance(result.angle, 0, .003) === false) {
                                
                                if(result.crossProduct > 0 )
                                {
                                    currentTower.towerRotation +=  .02
                                }
                                else{
                                    currentTower.towerRotation -=  .02;
                                }
                                if(Math.abs(result.crossProduct) < .04){
                                    shoot(currentTower,target,result.angle)
                                }
                                
                            }
                    }
                }
            }
        }
        function getGroundTarget(currentTurret,groundcreeps,dim){
            
            var groundTarget = {x:0, y:0,hitPointsPercentage:0}
            for(var i = 0; i < groundcreeps.creepList.length; ++i){
                if(currentTurret.target.row == 0 && currentTurret.target.col == 0){ //dont change targets unless necessary
                    if(groundcreeps.creepList[i].graphicsRow+topBarHeight < 0 || groundcreeps.creepList[i].graphicsCol < 0) { //ignore creeps off the grid
                        continue;
                    }
                    var distance = Math.sqrt(Math.pow(currentTurret.center.row - (groundcreeps.creepList[i].graphicsRow+topBarHeight),2)+Math.pow(currentTurret.center.col - groundcreeps.creepList[i].graphicsCol,2));
                    if(distance <= currentTurret.radius) {
                        groundTarget.x = groundcreeps.creepList[i].graphicsCol + (dim.height/2);
                        groundTarget.y = groundcreeps.creepList[i].graphicsRow+topBarHeight + (dim.width/2);
                        groundTarget.hitPointsPercentage = groundcreeps.creepList[i].hitPointsPercentage;
                        
                        //get for hp reduction
                        ret.creepListTarget = groundcreeps.creepList[i];
                    }
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
        function shoot(currentTurret,currentTarget,angle){
            //compute line, draw bullet
            
            if(currentTarget.x != 0 || currentTarget.y != 0){
                var dx,dy;
                dx = currentTarget.x - currentTurret.center.col;  
                dy = currentTarget.y - currentTurret.center.row;

                currentTurret.ammo.ammoCenter.col += Math.cos(dx)+dx/10;
                currentTurret.ammo.ammoCenter.row += Math.sin(dy)+dy/10;
                var hpreduction = 5;
                if(dy < 0 && dx < 0){
                    if(currentTurret.ammo.ammoCenter.col < currentTarget.x && currentTurret.ammo.ammoCenter.row < currentTarget.y){
                        currentTurret.ammo.ammoCenter.col = currentTurret.center.col;
                        currentTurret.ammo.ammoCenter.row = currentTurret.center.row;
                        ret.creepListTarget.hitPointsPercentage-=hpreduction;
                    }
                }
                if(dy < 0 && dx > 0){
                    if(currentTurret.ammo.ammoCenter.col > currentTarget.x && currentTurret.ammo.ammoCenter.row < currentTarget.y){
                        currentTurret.ammo.ammoCenter.col = currentTurret.center.col;
                        currentTurret.ammo.ammoCenter.row = currentTurret.center.row;
                        ret.creepListTarget.hitPointsPercentage-=hpreduction;
                    }
                }
                if(dy > 0 && dx > 0){
                    if(currentTurret.ammo.ammoCenter.col > currentTarget.x && currentTurret.ammo.ammoCenter.row > currentTarget.y){
                        currentTurret.ammo.ammoCenter.col = currentTurret.center.col;
                        currentTurret.ammo.ammoCenter.row = currentTurret.center.row;
                        ret.creepListTarget.hitPointsPercentage-=hpreduction;
                    }
                }
                if(dy > 0 && dx < 0){
                    if(currentTurret.ammo.ammoCenter.col < currentTarget.x && currentTurret.ammo.ammoCenter.row > currentTarget.y){
                        currentTurret.ammo.ammoCenter.col = currentTurret.center.col;
                        currentTurret.ammo.ammoCenter.row = currentTurret.center.row;
                        ret.creepListTarget.hitPointsPercentage-=hpreduction;
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
}(MyGame.graphics));