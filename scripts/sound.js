MyGame.sound = (function() {
    'use strict';
    
    function Sounds() {
        var ret = {
            click: new Audio("sounds/switch10.ogg"),
            creepReachedEnd: new Audio("sounds/lowDown.ogg"),
            towerUpgrade: new Audio("sounds/phaserUp4.ogg"),
            towerShoot: new Audio("sounds/laser1.ogg"),
            //creepDeath: new Audio("sounds/"),
            //towerSell: new Audio("sounds/"),
            //explosion: new Audio("sounds/"),
            //flyingCreepDeath: new Audio("sounds/"),
            gameOver: new Audio("sounds/jingles_SAX07.ogg")
        };

        var standardVolume = 0.5;

        ret.playClick = function() {
            ret.click.volume = standardVolume;
            ret.click.play();
            ret.click.currentTime = 0;
        }

        ret.playCreepEnd = function() {
            ret.creepReachedEnd.volume = standardVolume;
            ret.creepReachedEnd.play();
            ret.creepReachedEnd.currentTime = 0;
        }

        ret.playTowerUpgrade = function() {
            ret.towerUpgrade.volume = standardVolume;
            ret.towerUpgrade.play();
            ret.towerUpgrade.currentTime = 0;
        }

        ret.playTowerShoot = function() {
            ret.towerShoot.volume = standardVolume;
            ret.towerShoot.play();
            ret.towerShoot.currentTime = 0;
        }

        ret.playCreepDeath = function() {
            ret.creepDeath.volume = standardVolume;
            ret.creepDeath.play();
            ret.creepDeath.currentTime = 0;
        }

        ret.playFlyingCreepDeath = function() {
            ret.flyingCreepDeath.volume = standardVolume;
            ret.flyingCreepDeath.play();
            ret.flyingCreepDeath.currentTime = 0;
        }

        ret.playTowerSell = function() {
            ret.towerSell.volume = standardVolume;
            ret.towerSell.play();
            ret.towerSell.currentTime = 0;
        }

        ret.playExplosion = function() {
            ret.explosion.volume = standardVolume;
            ret.explosion.play();
            ret.explosion.currentTime = 0;
        }

        ret.playGameOver = function() {
            ret.gameOver.volume = standardVolume;
            ret.gameOver.play();
            ret.gameOver.currentTime = 0;
        }

        return ret;
    }
    

	return {
        Sounds : Sounds
	};
}());