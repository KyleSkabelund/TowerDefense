MyGame.screens['game-play'] = (function(game, graphics, input, init, tower, flyingCreeps, groundCreeps, astar, particleSystem, creepSpawner, sound) {
	
	var mouseCapture = false,
		myMouse = input.Mouse(),
		myKeyboard = input.Keyboard(),
		myTexture = null,
		cancelNextRequest = false,
		lastTimeStamp,
		grid = init.Grid(),
		selectedSquare = {x: -100, y: -100, radius:0},
		mousePosition = {x: -1, y:-1}, //uhh
		towerIsSelected = false,
		selectedTowerNumber = 0,
		Tower = tower.Tower({towerRoation:0, center:{x:0,y:0}});
		allFlyingCreeps = flyingCreeps.FlyingCreeps(),
		allGroundCreeps = groundCreeps.GroundCreeps(),
		pathfinder = astar.AStar(grid),
		refreshPaths = true,
		level = 1,
		lifes = {creepsAllowed: 0, max: 3}, 
		startingCash = 30,
		cash = 0,
		score = {currentScore: 0, forLevel2: 1000, forLevel3: 2000},
		showGrid = false,
		spawner = creepSpawner.CreepSpawner(),
		spawnCreeps = false,
		sounds = sound.Sounds(),
		towerNotPlacedMessage = {duration: 0, row: -1, col: -1},
		startLevelMessage = {fadeDuration: 0},
		creepReachedEndMessage = {duration: 0},
		modifiedTower = {row:-1,col:-2}
		showRadii = null;

		//will trigger when a creep reaches the end
		creepReachedEndMessage.setDuration = function() { 
			creepReachedEndMessage.duration = 300; //0-1000
			++lifes.creepsAllowed;
			if(lifes.creepsAllowed > lifes.max) {
				endGame();
			}
			sounds.playCreepEnd();
		}
		
		particleSystems = particleSystem.ParticleSystems();

	/*var level1TileMap =	[ 
		299, 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 02 ,
		23 , 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 25 ,
		23 , 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 25 ,
		157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
		157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
		157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
		157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
		23 , 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 25 ,
		23 , 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 25 ,
		46 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 48 ,
	];*/

	var level1TileMap =	[ 
		299, 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 01 , 02 ,
		23 , 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 25 ,
		27 , 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 26 ,
		157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
		157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
		157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
		157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157,
		04 , 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 03 ,
		23 , 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 157, 25 ,
		46 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 47 , 48 ,
	];
	
	var level2TileMap = [ 
		299, 01 , 01 , 01 , 01 , 01 , 01 , 27 , 232, 257, 257, 230, 26 , 01 , 01 , 01 , 01 , 01 , 01 , 02 ,
		23 , 157, 157, 157, 157, 157, 157, 157, 232, 257, 257, 230, 157, 157, 157, 157, 157, 157, 157, 25 ,
		27 , 157, 157, 157, 157, 157, 157, 157, 232, 257, 257, 230, 157, 157, 157, 157, 157, 157, 157, 26 ,
		254, 254, 254, 254, 254, 254, 254, 254, 255, 257, 257, 253, 254, 254, 254, 254, 254, 254, 254, 254, 
		257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257,
		257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257,
		208, 208, 208, 208, 208, 208, 208, 208, 209, 257, 257, 207, 208, 208, 208, 208, 208, 208, 208, 208, 
		04 , 157, 157, 157, 157, 157, 157, 157, 232, 257, 257, 230, 157, 157, 157, 157, 157, 157, 157, 03 ,
		23 , 157, 157, 157, 157, 157, 157, 157, 232, 257, 257, 230, 157, 157, 157, 157, 157, 157, 157, 25 ,
		46 , 47 , 47 , 47 , 47 , 47 , 47 , 04 , 232, 257, 257, 230, 03 , 47 , 47 , 47 , 47 , 47 , 47 , 48 ,
	];

	var level3TileMap = [ 
		157, 157, 157, 157, 157, 157, 157, 157, 232, 257, 257, 230, 157, 157, 157, 157, 157, 157, 157, 157, 
		157, 157, 157, 157, 157, 157, 157, 157, 232, 257, 257, 230, 157, 157, 157, 157, 157, 157, 157, 157, 
		157, 157, 157, 157, 157, 157, 157, 157, 232, 257, 257, 230, 157, 157, 157, 157, 157, 157, 157, 157, 
		254, 254, 254, 254, 254, 254, 254, 254, 255, 257, 257, 253, 254, 254, 254, 254, 254, 254, 254, 254, 
		257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257,
		257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257, 257,
		208, 208, 208, 208, 208, 208, 208, 208, 209, 257, 257, 207, 208, 208, 208, 208, 208, 208, 208, 208, 
		157, 157, 157, 157, 157, 157, 157, 157, 232, 257, 257, 230, 157, 157, 157, 157, 157, 157, 157, 157, 
		157, 157, 157, 157, 157, 157, 157, 157, 232, 257, 257, 230, 157, 157, 157, 157, 157, 157, 157, 157, 
		157, 157, 157, 157, 157, 157, 157, 157, 232, 257, 257, 230, 157, 157, 157, 157, 157, 157, 157, 157, 
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
		showRadii = localStorage['show-tower-coverage'] == "on" ? true : false;
		
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
			sounds.playTowerUpgrade();
		});
		myKeyboard.registerCommand(localStorage['sell-tower-config'],function(){
			var soldTowerCol = selectedSquare.x;
			var soldTowerRow = selectedSquare.y;
			
			if(grid.grid[soldTowerRow][soldTowerCol].tower.textureTopNumber != -1) {
				Tower.removeTower(grid,soldTowerRow,soldTowerCol);
				grid.totalTowers--;
				cash += 500; //tower value
				particleSystems.AddSoldTowerSystem(soldTowerRow, soldTowerCol, graphics, graphics.getCellDimensions(grid));
				sounds.playTowerSell();
				refreshPaths = true;
			}
		});
	
		myKeyboard.registerCommand(localStorage['start-level-config'],function(){
			spawnCreeps = true;
			startLevelMessage.fadeDuration = 1000;
			console.log("now spawning creeps");
		});
		document.getElementById('btnUpgrade').addEventListener('click',function(e){
			if(Tower.upgradeTower(grid,modifiedTower.row,modifiedTower.col)){
				sounds.playTowerUpgrade();
			}
			document.getElementById('upgrade').style.display = "none";
		})
		document.getElementById('btnSell').addEventListener('click',function(e){
			Tower.removeTower(grid,modifiedTower.row,modifiedTower.col);
			--grid.totalTowers;
			document.getElementById('upgrade').style.display = "none";
			sounds.playTowerSell();
			particleSystems.AddSoldTowerSystem(modifiedTower.row,modifiedTower.col,graphics, graphics.getCellDimensions(grid))
		})
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
		document.getElementById('new-Tower-3').addEventListener('click',function(e){
			towerIsSelected = true;
			selectedTowerNumber = 249;
			selectedSquare.radius = 500;
		})
		document.getElementById('new-Tower-4').addEventListener('click',function(e){
			towerIsSelected = true;
			selectedTowerNumber = 307;
			selectedSquare.radius = 500;
		})
		myMouse.registerCommand('mousedown', function(e) {
			let cellDimensions = graphics.getCellDimensions(grid);
			let gridRow = Math.floor(e.clientY / cellDimensions.height);
            let gridCol = Math.floor(e.clientX / cellDimensions.width);
			if(towerIsSelected && cash > 0){
				//dont allow tower to be placed on creep moving to square
				if(allGroundCreeps.creepInSquare(selectedSquare.y, selectedSquare.x)) {
					return;
				}

				//place the tower so a* can work its magic
				grid.placeTower(e.clientX, e.clientY, graphics.getCellDimensions(grid), selectedTowerNumber);
				
				//check if creeps starting left ending right have a path if no path remove the initial placement
				if(!pathfinder.pathToEndExists(selectedSquare.y, selectedSquare.x, leftToRightStarts, leftToRightEndings, grid)) {
					grid.removeTower(selectedSquare.y, selectedSquare.x);
					towerNotPlacedMessage.duration = 5000;
					towerNotPlacedMessage.row = selectedSquare.y;
					towerNotPlacedMessage.col = selectedSquare.x;
					selectedSquare.y = -100;
					selectedSquare.x = -100;
					towerIsSelected = false;
					return;
				}
				//if we are on level 2 or 3 check for top to bottom
				if(level > 1) {
					if(!pathfinder.pathToEndExists(selectedSquare.y, selectedSquare.x, topToBottomStarts, topToBottomEndings, grid)) {
						grid.removeTower(selectedSquare.y, selectedSquare.x);
						towerNotPlacedMessage.duration = 5000;
						towerNotPlacedMessage.row = selectedSquare.y;
						towerNotPlacedMessage.col = selectedSquare.x;
						selectedSquare.y = -100;
						selectedSquare.x = -100;
						towerIsSelected = false;
						return;
					}
				}
				selectedSquare.x = -1;
				selectedSquare.y = -1;
				towerIsSelected = false;
				refreshPaths = true; //tower has been placed so do pathfinding in next creep update
				sounds.playClick();
			}
			else{
				if(grid.grid[gridRow][gridCol].tower.textureTopNumber != -1){
					var x = document.getElementById('upgrade');
					x.style.display = "block";
					x.style.left = e.clientX  + 'px';
					x.style.top = e.clientY +'px';
					modifiedTower.row = gridRow;
					modifiedTower.col = gridCol;
				}
			}

			//particleSystems.AddBombExplosionSystem(3,14 , graphics, graphics.getCellDimensions(grid));
			//particleSystems.AddBombMovementSystem(5, 14, graphics, graphics.getCellDimensions(grid), Math.PI/2);
			//particleSystems.AddCreepDeathSystem(7, 9, graphics, graphics.getCellDimensions(grid), 1);
		});
		document.addEventListener('mousemove', function(e){
			//if(towerIsSelected){
				var dimensions = graphics.getCellDimensions(grid)
				var X,Y;
				X = Math.floor(e.clientX / dimensions.width);
				Y = Math.floor((e.clientY - topBarHeight )/ dimensions.height );

				selectedSquare.x = X;
				selectedSquare.y = Y;

				mousePosition.x = e.clientX;
				mousePosition.y = e.clientY;

			//}

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
		updateScore();
		updateCash();
		cellWidth = graphics.getCellDimensions(grid).width;
		cellHeight = graphics.getCellDimensions(grid).height;
		spawner.update(elapsedTime, allGroundCreeps, allFlyingCreeps, grid, graphics.getCellDimensions(grid), level, leftToRightEndings, topToBottomEndings, spawnCreeps);
		allGroundCreeps.updateCreeps(elapsedTime, grid, graphics.getCellDimensions(grid), pathfinder, refreshPaths, creepReachedEndMessage, sounds, particleSystems, graphics);
		allFlyingCreeps.updateCreeps(elapsedTime, grid, graphics.getCellDimensions(grid), creepReachedEndMessage, sounds, graphics, particleSystems);
		Tower.update(grid,allFlyingCreeps,allGroundCreeps,graphics.getCellDimensions(grid), sounds, elapsedTime);
		particleSystems.updateSystems(elapsedTime);
		refreshPaths = false;
		myKeyboard.update();
		myMouse.update(elapsedTime);

		if(level === 1 && score.forLevel2 <= score.currentScore) {
			advanceLevel(2);
		}

		if(level === 2 && score.forLevel3 <= score.currentScore) {
			advanceLevel(3);
		}

		if(towerNotPlacedMessage.duration > 0) towerNotPlacedMessage.duration -= elapsedTime;
		if(startLevelMessage.fadeDuration > 0) startLevelMessage.fadeDuration -= elapsedTime;
		if(creepReachedEndMessage.duration > 0) creepReachedEndMessage.duration -= elapsedTime;
	}
	
	function render() {
		graphics.clear();
		graphics.drawTiles(grid,selectedSquare,towerIsSelected);
		graphics.drawTowers(grid,showRadii);
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
		
		graphics.drawTopBar(cash, score.currentScore, lifes, mousePosition.x, mousePosition.y, level);
		graphics.startLevelMessage(spawnCreeps, startLevelMessage.fadeDuration, level);
		graphics.towerCannotBePlaced(towerNotPlacedMessage.duration, towerNotPlacedMessage.row, towerNotPlacedMessage.col, grid);

		graphics.creepReachedEndMessage(creepReachedEndMessage.duration);
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

	function endGame() {
		//change game loop to end state
		update = function(elapsedTime) {
			cellWidth = graphics.getCellDimensions(grid).width;
			cellHeight = graphics.getCellDimensions(grid).height;
			myKeyboard.update();
			myMouse.update(elapsedTime);
		};
		render = function() {
			graphics.clear();
			graphics.drawEndGame(score.currentScore);
		};
		update();
		render();

		//hide html buttons
		document.getElementById('topBar').style.display = 'none';


		var name = prompt("Name: ", "");
		socket.emit('new high score', { name: name, score: score.currentScore });
	}

	function advanceLevel(newLevel) {
		if(newLevel === 2) {
			currentTileMap = level2TileMap;
			grid.allocateMapNumbers(currentTileMap);
			graphics.loadTileImages(currentTileMap);
			level = newLevel;
		}
		if(newLevel === 3) {
			currentTileMap = level3TileMap;
			grid.allocateMapNumbers(currentTileMap);
			graphics.loadTileImages(currentTileMap);
			level = newLevel;
		}
	}

	function updateScore() {
		let groundCreepsScore = allGroundCreeps.creepsKilled * 50;
		let flyingCreepsScore = allFlyingCreeps.creepsKilled * 100;
		let towersScore = grid.totalTowers * 10;
		let levelScore = (level - 1) * 100;  

		score.currentScore = groundCreepsScore + flyingCreepsScore + towersScore + levelScore;
	}

	function updateCash() {
		let groundCreepsCash = allGroundCreeps.creepsKilled * 10;
		let flyingCreepsCash = allFlyingCreeps.creepsKilled * 20;
		cash = startingCash + groundCreepsCash + flyingCreepsCash - grid.totalTowers * 10;
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game, MyGame.graphics, MyGame.input, MyGame.init, MyGame.tower, MyGame.flyingCreeps, MyGame.groundCreeps, MyGame.aStar, MyGame.particleSystem, MyGame.creepSpawner, MyGame.sound));