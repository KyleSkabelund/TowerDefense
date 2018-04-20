MyGame.sound = (function() {
    'use strict';
    
    function Sounds() {
        var ret = {
            click: new Audio("sounds/switch10.ogg")
        };

        ret.playClick = function() {
            ret.click.play();
            ret.click.currentTime=0;
        }

        return ret;
    }
    

	return {
        Sounds : Sounds
	};
}());