MyGame.screens['main-menu'] = (function(game) {
	'use strict';
	
	function initialize() {
		//
		// Setup each of menu events for the screens
		document.getElementById('id-new-game').addEventListener(
			'click',
			function() {game.showScreen('game-play'); });
		
		document.getElementById('id-about').addEventListener(
			'click',
			function() { game.showScreen('about'); });
		document.getElementById('id-settings').addEventListener(
			'click',
			function() { game.showScreen('settings'); });
	}
	
	function run() {
		//
		// I know this is empty, there isn't anything to do.
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game));