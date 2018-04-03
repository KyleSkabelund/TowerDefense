MyGame.tower = (function() {
    'use strict';

    function Tower() {
        let ret = {
            textureTopNumber: -1, //no tower
		};

        ret.addTower = function(towerNumber) {
            ret.textureTopNumber = towerNumber;
        }

        ret.removeTower = function() {
            ret.textureTopNumber = -1;
        }

		return ret;
    }

    return {
        Tower : Tower
	};
}());