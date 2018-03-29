MyGame.screens['game-play'] = (function(game, graphics, input, init) {
	'use strict';
	
	var mouseCapture = false,
		myMouse = input.Mouse(),
		myKeyboard = input.Keyboard(),
		myTexture = null,
		cancelNextRequest = false,
		lastTimeStamp,
		grid = init.Grid();
	
	//Data/PNG/Retina/
	//will draw any tile number from Retina folder
	var currentTileMap = [ 
				157, 157, 157, 159, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 158, 157, 157, 157, 157, 157, 157,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 158, 158, 157, 157, 157, 157, 157,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 158, 158, 157, 157, 157, 157, 157,
				158, 158, 158, 158, 158, 158, 158, 158, 158, 158, 158, 158, 158, 158, 158, 158, 158, 158, 158, 158,
			];

	function initialize() {
		console.log('game initializing...');

		grid.fillGrid();
		grid.allocateMapNumbers(currentTileMap);

		graphics.loadTileImages(currentTileMap);

		window.addEventListener('resize', graphics.resizeCanvas, false);
		window.addEventListener('orientationchange', function() {
			graphics.resizeCanvas();
		}, false);
		window.addEventListener('deviceorientation', function() {
			graphics.resizeCanvas();
		}, false);

		//
		// Force the canvas to resize to the window first time in, otherwise
		// the canvas is a default we don't want.
		graphics.resizeCanvas();

		//
		// Create the keyboard input handler and register the keyboard commands
		myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
			cancelNextRequest = true;
			game.showScreen('main-menu');
		});
	}
	
	function update(elapsedTime) {
        myKeyboard.update();
	}
	
	function render() {
		graphics.clear();
		graphics.drawTopBar();
		graphics.drawTiles(grid);
		graphics.drawGrid(grid);
	}
	
	//------------------------------------------------------------------
	//
	// This is the Game Loop function!
	//
	//------------------------------------------------------------------
	function gameLoop(time) {
		let elapsedTime = time - lastTimeStamp;
		update(elapsedTime);
		render();

		lastTimeStamp = time;

		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}
	
	function run() {
		lastTimeStamp = performance.now();
		//
		// Start the animation loop
		cancelNextRequest = false;
		requestAnimationFrame(gameLoop);
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game, MyGame.graphics, MyGame.input, MyGame.init));