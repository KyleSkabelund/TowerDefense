// ------------------------------------------------------------------
//
//
// ------------------------------------------------------------------
const topBarHeight = 25;

MyGame.graphics = (function() {
	'use strict';
	
	var loadedImages = [];
	var tilesLoaded = false;
	var showCreepPath = localStorage["show-creep-path"] == "on" ? true : false;
	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d'),
        startTime = new Date()

	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};
	
	function clear() {
		context.clear();
	}

    function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

    

    function drawTopBar(cash, score, lifes, mouseX, mouseY) {
		context.fillStyle = 'black';
		context.fillRect(0, 0, canvas.width, topBarHeight);
        
		drawCash(cash);
		drawScore(score);
		drawLifesLeft(lifes);
		drawTowerInfo(mouseX, mouseY);
		drawLevel(level);
	}
	
	function drawCash(cash) {
		let xPos = 111+topBarHeight;
		let yPos = (topBarHeight/2)+6;
		
		context.drawImage(loadedImages[287], 116.3, 0, topBarHeight, topBarHeight);

		context.fillStyle = 'gray';
		context.strokeStyle= 'white'; 
  		context.lineWidth = 1;
		context.font = '16px Arial';
		context.textAlign = 'left';
		if(cash > 99999) {
			cash = '99999+';
		}
		context.fillText(cash, xPos, yPos);
		context.strokeText(cash, xPos, yPos);
	}

	function drawScore(score) {
		let xPos = canvas.width-125;
		let yPos = (topBarHeight/2)+6;
		
		context.fillStyle = 'gray';
		context.strokeStyle= 'white'; 
  		context.lineWidth = 1;
		context.font = '16px Arial';
		context.textAlign = 'Right';
		if(score > 9999999) {
			score = '9999999+';
		}
		context.fillText('Score: ' + score, xPos, yPos);
		context.strokeText('Score: ' + score, xPos, yPos);
	}

	function drawLifesLeft(lifes) {
		let xPos = canvas.width-300;
		let yPos = (topBarHeight/2)+6;
		
		context.fillStyle = 'gray';
		context.strokeStyle= 'white'; 
  		context.lineWidth = 1;
		context.font = '16px Arial';
		context.textAlign = 'Right';
		context.fillText('Enemies Allowed: ' + lifes.creepsAllowed + '/' + lifes.max, xPos, yPos);
		context.strokeText('Enemies Allowed: ' + lifes.creepsAllowed + '/' + lifes.max, xPos, yPos);
	}

	function drawLevel(level) {
		let xPos = canvas.width-375;
		let yPos = (topBarHeight/2)+6;
		
		context.fillStyle = 'gray';
		context.strokeStyle= 'white'; 
  		context.lineWidth = 1;
		context.font = '16px Arial';
		context.textAlign = 'Right';
		context.fillText('Level: ' + level, xPos, yPos);
		context.strokeText('Level: ' + level, xPos, yPos);
	}

    //drawText('16px', 10, 10, 'message', 'black')
    function drawText(fontSize, x, y, message, fill) {
        context.fillStyle = fill;
		context.font = fontSize + ' Arial';
        context.fillText(message, x, y);
	}

	function drawTowerInfo(mouseX, mouseY) {
		if(mouseY > topBarHeight) return;

		let message = '';

		if(0 <= mouseX && mouseX <= 25) {
			message = "Turret type 1 description";
		}
		else if(30.34 <= mouseX && mouseX <= 55.34) {
			message = "Turret type 2 description";
		}
		else if(60.68 <= mouseX && mouseX <= 84) {
			message = "Turret type 3 description";
		}
		else if(91.03 <= mouseX && mouseX <= 116.03) {
			message = "Turret type 4 description";
		}

		let xPos = 200;
		let yPos = (topBarHeight/2)+6;
		
		context.fillStyle = 'gray';
		context.strokeStyle= 'white'; 
  		context.lineWidth = 1;
		context.font = '16px Arial';
		context.textAlign = 'Left';
		context.fillText(message, xPos, yPos);
		context.strokeText(message, xPos, yPos);
	}

	function drawGrid(grid) {
		context.strokeStyle = '#8d6033';
		context.beginPath();

		let w = canvas.width / grid.cols;
		let h = (canvas.height - topBarHeight) / grid.rows;

		for(var ii = 0; ii < grid.rows; ++ii) {
			for(var jj = 0; jj < grid.cols; ++jj) {
				let topLeft =  		{x: jj*w, 		y: ii*h+topBarHeight}
				let topRight = 		{x: jj*w+w, 	y: ii*h+topBarHeight}
				let bottomRight = 	{x: jj*w+w, 	y: ii*h+h+topBarHeight}
				let bottomLeft = 	{x: jj*w, 		y: ii*h+h+topBarHeight}
				context.moveTo(topLeft.x, topLeft.y);
				context.lineTo(topRight.x, topRight.y);
				context.lineTo(bottomRight.x, bottomRight.y);
				context.lineTo(bottomLeft.x, bottomLeft.y);
				context.lineTo(topLeft.x, topLeft.y);
			}
		}
		context.lineWidth = 1;
		context.stroke();
	}

	function getLoadNumbers(map) {
		var ret = [];

		for(var i in map) {
			if(!ret.includes(map[i]))
			{
				ret.push(map[i]);
			}
		}
		//             * *
		//load towers \___/
		ret.push(180);
		ret.push(291);
		ret.push(292);
		ret.push(249);
		ret.push(250);
		ret.push(206);
		ret.push(205);
		ret.push(204);
		ret.push(203);

		// 						 * *
		//load flying creep 	_____
		ret.push(271);
		ret.push(294);

		//load ground creep
		ret.push(245);
		
		
//                          	 .  . 
//                               ____
//                              /    \
		//load bullet
		ret.push(275);
		//load animated ground creep
		ret.push(300);
		ret.push(302);
		//load animated flying creep 
		ret.push(301);

		//load money >-__->
		ret.push(287);

		return ret;
	}

	function loadTileImages(tileMap) {
		let loadNumbers = getLoadNumbers(tileMap);
		let loadedCount = 0;

		for(var ii = 0; ii < loadNumbers.length; ++ii) {
			var image = new Image();
			if(loadNumbers[ii] < 100){
				image.src = 'Data/PNG/Retina/towerDefense_tile0' + loadNumbers[ii] + '.png';
			}
			else{
				image.src = 'Data/PNG/Retina/towerDefense_tile' + loadNumbers[ii] + '.png';
			}
			
			if(loadNumbers[ii] < 10){
				image.src = 'Data/PNG/Retina/towerDefense_tile00' + loadNumbers[ii] + '.png';
			}

			loadedImages[loadNumbers[ii]] = image;

			image.onload = function() {
				++loadedCount;
				
				if(loadedCount == loadNumbers.length) tilesLoaded = true;
			};
		}
	};

	function drawTiles(grid,selected,towerIsSelected) {
		var dim = getCellDimensions(grid);
		let w = dim.width;
		let h = dim.height;

		for(var ii = 0; ii < grid.rows; ++ii) {
			for(var jj = 0; jj < grid.cols; ++jj) {
				if(tilesLoaded) {
					//draw tile
					context.drawImage(loadedImages[grid.grid[ii][jj].tileNumber], jj*w, ii*h+topBarHeight, w, h);
				}
			}
		}
	}
	function drawTowers(grid) {
		var dim = getCellDimensions(grid);
		let w = dim.width;
		let h = dim.height;

		for(var ii = 0; ii < grid.rows; ++ii) {
			for(var jj = 0; jj < grid.cols; ++jj) {
				if(tilesLoaded) {
					var towerTopNum = grid.grid[ii][jj].tower.textureTopNumber;
					var ammoType =  grid.grid[ii][jj].tower.ammo.type;
					var ammorow =  grid.grid[ii][jj].tower.ammo.center.row;
					var ammocol =  grid.grid[ii][jj].tower.ammo.center.col;
					if(towerTopNum != -1) { //if there is a tower to draw
						//draw a base graphic
						//the third paramater is the radius of the circle, will be used for each turrets raidus.
						
						context.drawImage(loadedImages[180], jj*w, ii*h+topBarHeight, w, h);
						context.save();
						context.translate(jj*w + w/2, ii*h + topBarHeight + h/2);
						context.rotate(grid.grid[ii][jj].tower.towerRotation);		
						context.translate(-(jj*w + w/2),-( ii*h + topBarHeight + h/2));
						context.drawImage(loadedImages[towerTopNum], jj*w, ii*h+topBarHeight, w, h);
						context.restore();
						context.drawImage(loadedImages[ammoType], ammocol, ammorow, w/2, h/2);
						//draw the tower top
					}	
				}
			}
		}
	}

	function drawSelected(grid,selected,towerNumber)
	{
		var dime  = getCellDimensions(grid)
		var w = dime.width;
		var h = dime.height;
		if(selected.x >= 0 && selected.y >= 0){

			if(tilesLoaded) {
				var towerTopNum = grid.grid[selected.y][selected.x].tower.textureTopNumber;
				if(towerTopNum != -1){
					context.fillStyle ="rgb(255,0,0,.8)";
				}
				else{
					context.fillStyle ="rgb(255,255,0,.8)";
				}

				context.beginPath();
				//the third paramater is the radius of the circle, will be used for each turrets raidus.
				context.arc(selected.x*w+(w/2),selected.y*h+topBarHeight+(h/2),100,0,2*Math.PI);
				context.fill();
				
				
				context.drawImage(loadedImages[180], 
					selected.x*w,
					selected.y*h+topBarHeight,
					w,
					h);
				context.drawImage(loadedImages[towerNumber], 
					selected.x*w,
					selected.y*h+topBarHeight,
					w,
					h);
			}
		}
	}

	function drawFlyingCreeps(creeps, grid) {
		let dim = getCellDimensions(grid);

		if(tilesLoaded) {
			for(var ii = 0; ii < creeps.creepList.length; ++ii) {
				context.save();

				let centerX = creeps.creepList[ii].graphicsCol+(dim.width/2);
				let centerY = creeps.creepList[ii].graphicsRow+25+(dim.height/2)

				context.translate(centerX, centerY);
				context.rotate(creeps.creepList[ii].rotation);
				context.translate(-centerX, -centerY);

				context.drawImage(loadedImages[creeps.creepList[ii].tileNumber], //image to draw
					creeps.creepList[ii].currentSprite * 128, 0, //x and y of where to start clipping
					128, 128, //width and height of clipped image
					creeps.creepList[ii].graphicsCol, //x coordinate where to place
					creeps.creepList[ii].graphicsRow+topBarHeight, //y coordinate where to place
					dim.width, dim.height); //width and height of image to use
				
				context.restore();

				//draw red bar
				context.fillStyle = "red";
				var maxHpWidth = dim.width/2;
				context.fillRect(centerX-(dim.width/4), creeps.creepList[ii].graphicsRow+topBarHeight+dim.height/8, maxHpWidth, dim.height/10)
				//draw green bar over it
				context.fillStyle = "green";
				var hpWidth = (creeps.creepList[ii].hitPointsPercentage/100) * maxHpWidth;
				context.fillRect(centerX-(dim.width/4), creeps.creepList[ii].graphicsRow+topBarHeight+dim.height/8, hpWidth, dim.height/10)
			}
		}
	}

	function drawGroundCreeps(creeps, grid) {
		let dim = getCellDimensions(grid);

		if(tilesLoaded) {
			for(var ii = 0; ii < creeps.creepList.length; ++ii) {
				context.save();

				let centerX = creeps.creepList[ii].graphicsCol+(dim.width/2);
				let centerY = creeps.creepList[ii].graphicsRow+25+(dim.height/2)

				context.translate(centerX, centerY);
				context.rotate(creeps.creepList[ii].rotation);
				context.translate(-centerX, -centerY);

				context.drawImage(loadedImages[creeps.creepList[ii].tileNumber], //image to draw
					creeps.creepList[ii].currentSprite * 128, 0, //x and y of where to start clipping
					128, 128, //width and height of clipped image
					creeps.creepList[ii].graphicsCol, //x coordinate where to place
					creeps.creepList[ii].graphicsRow+topBarHeight, //y coordinate where to place
					dim.width, dim.height); //width and height of image to use
				
				context.restore();

				//draw red bar
				context.fillStyle = "red";
				var maxHpWidth = dim.width/2;
				context.fillRect(centerX-(dim.width/4), creeps.creepList[ii].graphicsRow+topBarHeight+dim.height/8, maxHpWidth, dim.height/10)
				//draw green bar over it
				context.fillStyle = "green";
				var hpWidth = (creeps.creepList[ii].hitPointsPercentage/100) * maxHpWidth;
				context.fillRect(centerX-(dim.width/4), creeps.creepList[ii].graphicsRow+topBarHeight+dim.height/8, hpWidth, dim.height/10)

				var path = creeps.creepList[ii].pathToEnd;
				if(showCreepPath){
					if(path == undefined) {
						console.log("not able to render undefined creep path");
						return;
					}
					else{
						for(var jj = 0; jj < path.length; ++jj) {
							context.fillStyle = 'rgb(0,0,0,.01)';
							context.fillRect(path[jj].col*dim.width, path[jj].row*dim.height+topBarHeight, dim.width , dim.height )
						}
					}
				}
			}
		}
	}

	function drawParticle(position, size, rotation, image, alpha) {
		context.save();
		context.globalAlpha = alpha;
		let centerX = position.x+size/2;
		let centerY = position.y+size/2;

		context.translate(centerX, centerY);
		context.rotate(rotation);
		context.translate(-centerX, -centerY);
		context.drawImage(image, position.x, position.y, size, size);

		context.restore();
	}

	function startLevelMessage(spawnCreeps, fadeDuration, level) {
		if(fadeDuration > 0) { //only runs after key has been pressed to fade the text
			let startKey = String.fromCharCode(localStorage[startButton.id]).toLocaleLowerCase();
			context.fillStyle = 'white';
			context.strokeStyle= 'black'; 
  			context.lineWidth = 3;
			context.font = '64px Arial';
			context.textAlign = 'center';
			context.globalAlpha = getAlpha(fadeDuration, '1.0');
			if(fadeDuration <= 0) context.globalAlpha = '1.0';
			context.fillText('Press ' + startKey + ' to start level ' + level, canvas.width/2, canvas.height+topBarHeight-64);
			context.strokeText('Press ' + startKey + ' to start level ' + level, canvas.width/2, canvas.height+topBarHeight-64);
			context.globalAlpha = '1.0';
		}
		else if(spawnCreeps == false) { //mainly running to show static text
			let startKey = String.fromCharCode(localStorage[startButton.id]).toLocaleLowerCase();
			context.fillStyle = 'white';
			context.strokeStyle= 'black'; 
  			context.lineWidth = 3;
			context.font = '64px Arial';
			context.textAlign = 'center';
			context.fillText('Press ' + startKey + ' to start level ' + level, canvas.width/2, canvas.height+topBarHeight-64);
			context.strokeText('Press ' + startKey + ' to start level ' + level, canvas.width/2, canvas.height+topBarHeight-64);
		}
	}

	function towerCannotBePlaced(messageDuration, row, col, grid) {
		if(messageDuration > 0) {
			context.fillStyle = 'white';
			context.strokeStyle= 'black'; 
  			context.lineWidth = 3;
			context.font = '64px Arial';
			context.textAlign = 'center';
			context.globalAlpha = getAlpha(messageDuration, '1.0');
			context.fillText('Placing a tower here blocks the exit', canvas.width/2, (canvas.height+topBarHeight)/2);
			context.strokeText('Placing a tower here blocks the exit', canvas.width/2, (canvas.height+topBarHeight)/2);
			context.globalAlpha = '1.0';
		
			let dim = getCellDimensions(grid);
			context.fillStyle = "rgb(255, 255, 0, 0.8)";
			context.globalAlpha = getAlpha(messageDuration, '0.6');
			context.fillRect(col*dim.width+1, row*dim.height+topBarHeight+1, dim.width-1, dim.height-1);
			context.globalAlpha = '1.0';
		}
	}

	function creepReachedEndMessage(messageDuration) {
		if(messageDuration > 0) {
			context.globalAlpha = getAlpha(messageDuration, '1.0');
			context.fillStyle = 'red';
			context.fillRect(0,topBarHeight,canvas.width, canvas.height-topBarHeight);
			context.globalAlpha = '1.0';
		}
	}

	function getAlpha(timeLeft, standardAlpha) {
		let a = standardAlpha;
		if(standardAlpha > 0.9 && timeLeft < 900) {
			a = '0.9';
		}
		if(standardAlpha > 0.8 && timeLeft < 800) {
			a = '0.8';
		}
		if(standardAlpha > 0.7 && timeLeft < 700) {
			a = '0.7';
		}
		if(standardAlpha > 0.6 && timeLeft < 600) {
			a = '0.6';
		}
		if(standardAlpha > 0.5 && timeLeft < 500) {
			a = '0.5';
		}
		if(standardAlpha > 0.4 && timeLeft < 400) {
			a = '0.4';
		}
		if(standardAlpha > 0.3 && timeLeft < 300) {
			a = '0.3';
		}
		if(standardAlpha > 0.2 && timeLeft < 200) {
			a = '0.2';
		}
		if(standardAlpha > 0.1 && timeLeft < 100) {
			a = '0.1';
		}
		return a;
	}

	function getCellDimensions(grid) {
		let w = canvas.width / grid.cols;
        let h = (canvas.height - topBarHeight) / grid.rows;

		return { width: w, height: h };
	}


	return {
		clear : clear,
        drawTopBar : drawTopBar,
        resizeCanvas : resizeCanvas,
		drawGrid : drawGrid,
		loadTileImages : loadTileImages,
		drawTiles : drawTiles,
		drawSelected : drawSelected,
		getCellDimensions : getCellDimensions,
		drawFlyingCreeps : drawFlyingCreeps,
		drawGroundCreeps : drawGroundCreeps,
		drawParticle : drawParticle,
		drawTowers : drawTowers,
		startLevelMessage : startLevelMessage,
		towerCannotBePlaced : towerCannotBePlaced,
		creepReachedEndMessage : creepReachedEndMessage
	};
}());
