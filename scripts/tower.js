MyGame.tower = (function() {
    'use strict';

    function Tower() {
        let ret = {
            textureTopNumber: -1, //no tower
		};

        ret.addTower = function() {
            ret.textureTopNumber = 291;
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