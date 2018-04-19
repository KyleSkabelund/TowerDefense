MyGame.screens['game-play'] = (function(game, graphics, input, init, tower, flyingCreeps, groundCreeps, astar, particleSystem, creepSpawner) {
	
	var mouseCapture = false,
		myMouse = input.Mouse(),
		myKeyboard = input.Keyboard(),
		myTexture = null,
		cancelNextRequest = false,
		lastTimeStamp,
		grid = init.Grid(),
		selectedSquare = {x: -100, y: -100, radius:0},
		towerIsSelected = false,
		selectedTowerNumber = 0,
		Tower = tower.Tower({towerRoation:0, center:{x:0,y:0}});
		allFlyingCreeps = flyingCreeps.FlyingCreeps(),
		allGroundCreeps = groundCreeps.GroundCreeps(),
		pathfinder = astar.AStar(grid),
		refreshPaths = true,
		level = 3,
		showGrid = false,
		spawner = creepSpawner.CreepSpawner();
		spawnCreeps = false;
		
		particleSystems = particleSystem.ParticleSystems();

	var level1TileMap =	[ 
				299, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 01, 02,
				23, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 25,
				23, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 25,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
				157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
				23, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 25,
				23, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 25,
				46, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 48,
			];
	
	var level2TileMap = [ 
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

	
	//Data/PNG/Retina/
	//will draw any tile number from Retina folder
	var currentTileMap = level1TileMap;

	var leftToRightStarts = [{row: 3, col: 0}, {row: 4, col: 0}, {row: 5, col: 0}, {row: 6, col: 0}];
	var leftToRightEndings = [{row: 3, col: 19}, {row: 4, col: 19}, {row: 5, col: 19}, {row: 6, col: 19}];
	var topToBottomStarts = [{row: 0, col: 8}, {row: 0, col: 9}, {row: 0, col: 10}, {row: 0, col: 11}];
	var topToBottomEndings = [{row: 9, col: 8}, {row: 9, col: 9}, {row: 9, col: 10}, {row: 9, col: 11}];
			
	function initialize() {
		console.log('game initializing...');
		//grid init
		showGrid = localStorage["grid-placement"] == "on" ? true : false;
		
		grid.fillGrid();
		grid.allocateMapNumbers(currentTileMap);

		//render init
		graphics.loadTileImages(currentTileMap);

		window.addEventListener('resize', function() {
			graphics.resizeCanvas();
			allGroundCreeps.resizeCanvas(graphics.getCellDimensions(grid));
			allFlyingCreeps.resizeCanvas(graphics.getCellDimensions(grid));
		}, false);
		window.addEventListener('orientationchange', function() {
			graphics.resizeCanvas();
			allGroundCreeps.resizeCanvas(graphics.getCellDimensions(grid));
			allFlyingCreeps.resizeCanvas(graphics.getCellDimensions(grid));
		}, false);
		window.addEventListener('deviceorientation', function() {
			graphics.resizeCanvas();
			allGroundCreeps.resizeCanvas(graphics.getCellDimensions(grid));
			allFlyingCreeps.resizeCanvas(graphics.getCellDimensions(grid));
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
			let soldTowerRow = 9;
			let soldTowerCol = 0;
			//sell the tower
			particleSystems.AddSoldTowerSystem(soldTowerRow, soldTowerCol, graphics, graphics.getCellDimensions(grid));
			refreshPaths = true;
		});
		myKeyboard.registerCommand(localStorage['start-level-config'],function(){
			spawnCreeps = true;
			console.log("now spawning creeps");
		});

		document.getElementById('new-Tower').addEventListener('click',function(e){
			towerIsSelected = true;
			selectedTowerNumber = 291;
			selectedSquare.radius = 300;
		})
		document.getElementById('new-Tower-2').addEventListener('click',function(e){
			towerIsSelected = true;
			selectedTowerNumber = 292;
			selectedSquare.radius = 500;
		})
		myMouse.registerCommand('mousedown', function(e) {
			if(towerIsSelected){
				//dont allow tower to be placed on creep moving to square
				if(allGroundCreeps.creepInSquare(selectedSquare.y, selectedSquare.x)) {
					return;
				}

				//place the tower so a* can work its magic
				grid.placeTower(e.clientX, e.clientY, graphics.getCellDimensions(grid), selectedTowerNumber);
				
				//check if creeps starting left ending right have a path if no path remove the initial placement
				if(!pathfinder.pathToEndExists(selectedSquare.y, selectedSquare.x, leftToRightStarts, leftToRightEndings, grid)) {
					grid.removeTower(selectedSquare.y, selectedSquare.x);
					return;
				}
				//if we are on level 2 or 3 check for top to bottom
				if(level > 1) {
					if(!pathfinder.pathToEndExists(selectedSquare.y, selectedSquare.x, topToBottomStarts, topToBottomEndings, grid)) {
						grid.removeTower(selectedSquare.y, selectedSquare.x);
						return;
					}
				}
				selectedSquare.x = -1;
				selectedSquare.y = -1;
				towerIsSelected = false;
				refreshPaths = true; //tower has been placed so do pathfinding in next creep update
			}
			//particleSystems.AddBombExplosionSystem(3,14 , graphics, graphics.getCellDimensions(grid));
			//particleSystems.AddBombMovementSystem(5, 14, graphics, graphics.getCellDimensions(grid), Math.PI/2);
			//particleSystems.AddCreepDeathSystem(7, 9, graphics, graphics.getCellDimensions(grid), 1);
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
		/*myKeyboard.registerCommand(KeyEvent.DOM_VK_UP, function() {
			allGroundCreeps.creepList[0].moveUp(grid);
		});
		myKeyboard.registerCommand(KeyEvent.DOM_VK_DOWN, function() {
			allGroundCreeps.creepList[0].moveDown(grid);
		});
		myKeyboard.registerCommand(KeyEvent.DOM_VK_LEFT, function() {
			allGroundCreeps.creepList[0].moveLeft(grid);
		});
		myKeyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, function() {
			allGroundCreeps.creepList[0].moveRight(grid);
		});*/

		
	}
	
	function update(elapsedTime) {
		cellWidth = graphics.getCellDimensions(grid).width;
		cellHeight = graphics.getCellDimensions(grid).height;
		spawner.update(elapsedTime, allGroundCreeps, allFlyingCreeps, grid, graphics.getCellDimensions(grid), level, leftToRightEndings, topToBottomEndings, spawnCreeps);
		allGroundCreeps.updateCreeps(elapsedTime, grid, graphics.getCellDimensions(grid), pathfinder, refreshPaths);
		allFlyingCreeps.updateCreeps(elapsedTime, grid, graphics.getCellDimensions(grid));
		Tower.update(grid,allFlyingCreeps,allGroundCreeps,graphics.getCellDimensions(grid));
		particleSystems.updateSystems(elapsedTime);
		refreshPaths = false;
		myKeyboard.update();
		myMouse.update(elapsedTime);
	}
	
	function render() {
		graphics.clear();
		graphics.drawTiles(grid,selectedSquare,towerIsSelected);
		graphics.drawTowers(grid);
		if(towerIsSelected == true){
			graphics.drawSelected(grid,selectedSquare,selectedTowerNumber);
		}
		if(showGrid == true)
		{
			graphics.drawGrid(grid);
		}

		graphics.drawGroundCreeps(allGroundCreeps, grid);
		graphics.drawFlyingCreeps(allFlyingCreeps, grid);

		particleSystems.renderSystems(graphics);
		
		graphics.drawTopBar();
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
}(MyGame.game, MyGame.graphics, MyGame.input, MyGame.init, MyGame.tower, MyGame.flyingCreeps, MyGame.groundCreeps, MyGame.aStar, MyGame.particleSystem, MyGame.creepSpawner));