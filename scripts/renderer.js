// ------------------------------------------------------------------
//
//
// ------------------------------------------------------------------
const topBarHeight = 25;

MyGame.graphics = (function() {
	'use strict';
	
	var loadedImages = [];
	var tilesLoaded = false;

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

    

    function drawTopBar() {
		context.fillStyle = 'black';
        let standardFont = '16px';
        let fontFill = 'rgba(0, 0, 0, 0.7)';

		context.fillRect(0, 0, canvas.width, topBarHeight);
        
        //drawText(standardFont, 10, 16, 'Canvas Width: ' + canvas.width + ' Canvas Height: ' + canvas.height, fontFill);
    }

    //drawText('16px', 10, 10, 'message', 'black')
    function drawText(fontSize, x, y, message, fill) {
        context.fillStyle = fill;
		context.font = fontSize + ' Arial';
        context.fillText(message, x, y);
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

					var towerTopNum = grid.grid[ii][jj].tower.textureTopNumber;
					if(towerTopNum != -1) { //if there is a tower to draw
						//draw a base graphic
						context.drawImage(loadedImages[180], jj*w, ii*h+topBarHeight, w, h);
						context.save();
						context.translate(jj*w + w/2, ii*h + topBarHeight + h/2);
						context.rotate(grid.grid[ii][jj].tower.towerRotation);				
						context.translate(-(jj*w + w/2),-( ii*h + topBarHeight + h/2));
						context.drawImage(loadedImages[towerTopNum], jj*w, ii*h+topBarHeight, w, h);
						context.restore();
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
				context.arc(selected.x*w+(w/2),selected.y*h+topBarHeight+(h/2),50,0,2*Math.PI);
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

				context.drawImage(loadedImages[creeps.creepList[ii].tileNumber], creeps.creepList[ii].graphicsCol, creeps.creepList[ii].graphicsRow+25, dim.width, dim.height);
				
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

				context.drawImage(loadedImages[creeps.creepList[ii].tileNumber], creeps.creepList[ii].graphicsCol, creeps.creepList[ii].graphicsRow+topBarHeight, dim.width, dim.height);
				
				context.restore();

				//draw red bar
				context.fillStyle = "red";
				var maxHpWidth = dim.width/2;
				context.fillRect(centerX-(dim.width/4), creeps.creepList[ii].graphicsRow+topBarHeight+dim.height/8, maxHpWidth, dim.height/10)
				//draw green bar over it
				context.fillStyle = "green";
				var hpWidth = (creeps.creepList[ii].hitPointsPercentage/100) * maxHpWidth;
				context.fillRect(centerX-(dim.width/4), creeps.creepList[ii].graphicsRow+topBarHeight+dim.height/8, hpWidth, dim.height/10)

				/*if(creeps.creepList[ii].stopped) {
					var path = creeps.creepList[ii].pathToEnd;
					if(path == undefined) {
						console.log("not able to render undefined creep path");
						return;
					}
					for(var jj = 0; jj < path.length; ++jj) {
						context.fillStyle = 'black';
						context.fillRect(path[jj].col*dim.width, path[jj].row*dim.height+topBarHeight, dim.width / 4, dim.height / 4)
					}
				}*/
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
		drawParticle : drawParticle
	};
}());
