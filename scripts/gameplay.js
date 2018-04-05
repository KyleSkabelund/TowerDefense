var showGrid = false;
MyGame.screens['game-play'] = (function(game, graphics, input, init, tower, flyingCreeps) {
	
	var mouseCapture = false,
		myMouse = input.Mouse(),
		myKeyboard = input.Keyboard(),
		myTexture = null,
		cancelNextRequest = false,
		lastTimeStamp,
		grid = init.Grid(),
		selectedSquare = {x: -100, y: -100},
		towerIsSelected = false,
		selectedTowerNumber = 0,
		allFlyingCreeps = flyingCreeps.FlyingCreeps();
		
	
	//Data/PNG/Retina/
	//will draw any tile number from Retina folder
	var currentTileMap = [ 
				299, 01, 01, 01, 01, 01, 01, 01, 157, 157, 157, 157, 01, 01, 01, 01, 01, 01, 01, 02,
				23, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 25,
				23, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 25,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
				23, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 25,
				23, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 25,
				46, 47, 47, 47, 47, 47, 47, 47, 157, 157, 157, 157, 47, 47, 47, 47, 47, 47, 47, 48,
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
		myKeyboard.registerCommand(localStorage['upgrade-tower-config'],function(){
			//upgrade the tower
		});
		myKeyboard.registerCommand(localStorage['sell-tower-config'],function(){
			//sell the tower
		});
		myKeyboard.registerCommand(localStorage['start-level-config'],function(){
			//start the level
		});

		document.getElementById('new-Tower').addEventListener('click',function(e){
			towerIsSelected = true;
			selectedTowerNumber = 291;
		})
		document.getElementById('new-Tower-2').addEventListener('click',function(e){
			towerIsSelected = true;
			selectedTowerNumber = 292;
		})
		myMouse.registerCommand('mousedown', function(e) {
			if(towerIsSelected){
				grid.placeTower(e.clientX, e.clientY, graphics.getCellDimensions(grid), selectedTowerNumber);
				selectedSquare.x = -1;
				selectedSquare.y = -1;
				towerIsSelected = false;
			}
		});
		document.addEventListener('mousemove', function(e){
			if(towerIsSelected){
				var dimensions = graphics.getCellDimensions(grid)
				var X,Y;
				X = Math.floor(e.clientX / dimensions.width);
				Y = Math.floor((e.clientY - topBarHeight )/ dimensions.height );

				selectedSquare.x = X;
				selectedSquare.y = Y;

			}

		}
		, false);


		//
		//flying creep movement
		allFlyingCreeps.addCreep(5,5,grid,graphics.getCellDimensions(grid));

		myKeyboard.registerCommand(KeyEvent.DOM_VK_UP, function() {
			allFlyingCreeps.creepList[0].moveUp(grid);
		});
		myKeyboard.registerCommand(KeyEvent.DOM_VK_DOWN, function() {
			allFlyingCreeps.creepList[0].moveDown(grid);
		});
		myKeyboard.registerCommand(KeyEvent.DOM_VK_LEFT, function() {
			allFlyingCreeps.creepList[0].moveLeft(grid);
		});
		myKeyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, function() {
			allFlyingCreeps.creepList[0].moveRight(grid);
		});

		//
		//
	}
	
	function update(elapsedTime) {
		showGrid = localStorage["grid-placement"] == "on" ? true : false;
		cellWidth = graphics.getCellDimensions(grid).width;
		cellHeight = graphics.getCellDimensions(grid).height;
		allFlyingCreeps.updateCreeps(elapsedTime, grid, graphics.getCellDimensions(grid));
		myKeyboard.update();
		myMouse.update(elapsedTime);
	}
	
	function render() {
		graphics.clear();
		graphics.drawTopBar();
		graphics.drawTiles(grid,selectedSquare,towerIsSelected);
		if(towerIsSelected == true){
			graphics.drawSelected(grid,selectedSquare,selectedTowerNumber);
		}
		if(showGrid == true)
		{
			graphics.drawGrid(grid);
		}

		graphics.drawFlyingCreeps(allFlyingCreeps, grid);
		
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
}(MyGame.game, MyGame.graphics, MyGame.input, MyGame.init, MyGame.tower, MyGame.flyingCreeps));