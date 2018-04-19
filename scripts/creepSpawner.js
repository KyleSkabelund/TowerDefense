MyGame.creepSpawner = (function(graphics, random) {
    'use strict';

    function CreepSpawner() {
        let ret = {
            maxCreepsLevel0: 10,
            maxCreepsLevel1: 20,
            maxCreepsLevel2: 30,
            nextCreepTimeLeft: 0,
            nextCreepTimeTop: Random.nextGaussian(3000, 2000),
            maxFlyingCreeps: 5,
            nextFlyingCreepTimeTop: Random.nextGaussian(5000, 1000),
            nextFlyingCreepTimeLeft: Random.nextGaussian(1000, 500),
            level1Random: {mean: 4000, stddev: 2000},
            level2Random: {mean: 3000, stddev: 2000},
            level3Random: {mean: 3000, stddev: 2000}
        };

        ret.update = function(elapsedTime, groundCreeps, flyingCreeps, grid, dim, level, LRends, TBends) {
            if(ret.nextCreepTimeLeft <= 0) {
                if(level == 1) {
                    if(groundCreeps.creepList.length < ret.maxCreepsLevel0) {
                        var nextRow = Random.nextRange(3, 6);
                        allGroundCreeps.addCreep(nextRow, -1, LRends, grid, dim);
                        ret.nextCreepTimeLeft = Random.nextGaussian(ret.level1Random.mean, ret.level1Random.stddev);
                    }
                }

                if(level >= 2) {
                    if(groundCreeps.creepList.length < ret.maxCreepsLevel1) {
                        var nextRow = Random.nextRange(3, 6);
                        allGroundCreeps.addCreep(nextRow, -1, LRends, grid, dim);
                        ret.nextCreepTimeLeft = Random.nextGaussian(ret.level2Random.mean, ret.level2Random.stddev);
                    }
                }
            }

            if(level > 1 && ret.nextCreepTimeTop <= 0) {
                if(level >= 2) {
                    if(groundCreeps.creepList.length < ret.maxCreepsLevel1) {
                        var nextCol = Random.nextRange(8, 11);
                        allGroundCreeps.addCreep(-1, nextCol, TBends, grid, dim);
                        ret.nextCreepTimeTop = Random.nextGaussian(ret.level2Random.mean, ret.level2Random.stddev);
                    }
                }
            }

            if(level >=3) {
                if(ret.nextFlyingCreepTimeTop <= 0) {
                    if(flyingCreeps.creepList.length < ret.maxFlyingCreeps) {
                        var nextCol = Random.nextRange(8, 11);
                        allFlyingCreeps.addCreep(-1, nextCol, {row: grid.rows-1, col: nextCol}, grid, dim);
                        ret.nextFlyingCreepTimeTop = Random.nextGaussian(ret.level3Random.mean, ret.level3Random.stddev);
                    }
                }

                if(ret.nextFlyingCreepTimeLeft <=0) {
                    if(flyingCreeps.creepList.length < ret.maxFlyingCreeps) {
                        var nextRow = Random.nextRange(3, 6);
                        allFlyingCreeps.addCreep(nextRow, -1, {row: nextRow, col: grid.cols-1}, grid, dim);
                        ret.nextFlyingCreepTimeLeft = Random.nextGaussian(ret.level3Random.mean, ret.level3Random.stddev);
                    }
                }
            }

            ret.nextCreepTimeLeft -= elapsedTime;
            ret.nextCreepTimeTop -= elapsedTime;
            ret.nextFlyingCreepTimeLeft -= elapsedTime;
            ret.nextFlyingCreepTimeTop -= elapsedTime;
        }

        return ret;
    }
    
    return {
        CreepSpawner : CreepSpawner
	};
}(MyGame.graphics, MyGame.random));