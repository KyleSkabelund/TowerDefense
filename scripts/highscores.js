MyGame.screens['high-scores'] = (function(game) {
    'use strict';
	
	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { game.showScreen('main-menu'); });
    }

    var highScores = null;
    
    socket.on('refresh high scores', function(data) {
        highScores = data;
    });
	
	function run() {
        
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game));