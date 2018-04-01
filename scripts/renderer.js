// ------------------------------------------------------------------
//
//
// ------------------------------------------------------------------
MyGame.graphics = (function() {
	'use strict';
	
	var loadedImages = [];
	var tilesLoaded = false;

	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d'),
        startTime = new Date(),
		topBarHeight = 25;

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
		context.fillStyle = 'white';
        let standardFont = '16px';
        let fontFill = 'rgba(0, 0, 0, 0.7)';

		context.fillRect(0, 0, canvas.width, topBarHeight);
        
        drawText(standardFont, 10, 16, 'Canvas Width: ' + canvas.width + ' Canvas Height: ' + canvas.height, fontFill);
    }

    //drawText('16px', 10, 10, 'message', 'black')
    function drawText(fontSize, x, y, message, fill) {
        context.fillStyle = fill;
		context.font = fontSize + ' Arial';
        context.fillText(message, x, y);
	}

	function drawGrid(grid) {
		context.fillStyle = grid.fillStyle;
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
		context.lineWidth = .5;
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

		//load towers *_*
		ret.push(291);
		ret.push(292);
		ret.push(249);
		ret.push(250);
		ret.push(206);
		ret.push(205);
		ret.push(204);
		ret.push(203);

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

			loadedImages[loadNumbers[ii]] = image;

			image.onload = function() {
				++loadedCount;
				
				if(loadedCount == loadNumbers.length) tilesLoaded = true;
			};
		}
	};

	function drawTiles(grid) {
		let w = canvas.width / grid.cols;
		let h = (canvas.height - topBarHeight) / grid.rows;
		for(var ii = 0; ii < grid.rows; ++ii) {
			for(var jj = 0; jj < grid.cols; ++jj) {
				if(tilesLoaded) {
					var tile = grid.grid[ii][jj].tileNumber;
					context.drawImage(loadedImages[tile],
					 					jj*w,
					  					ii*h+topBarHeight,
					   					w,
										h);

					var towerTopNum = grid.grid[ii][jj].tower.textureTopNumber;
					if(towerTopNum != -1) { //if no tower on square
						context.drawImage(loadedImages[towerTopNum], 
						 					jj*w,
						  					ii*h+topBarHeight,
						   					w,
											h);
					}
				}
			}
		}
	}

	function drawTower(x, y, grid) {
		if(tilesLoaded) {
			var tower = grid.grid[x][y].tower;
			if(tower == null) return; //if no tower on square
			var dim = getCellDimensions();
			context.drawImage(loadedImages[tower.textureTopNumber], y*dim.width, x*dim.height+topBarHeight, dim.w, dim.h);
		}
	}

	function getCellDimensions(grid) {
		let w = canvas.width / grid.cols;
        let h = (canvas.height - topBarHeight) / grid.rows;

		return { width: w, height: h };
	}

	function getTopBarHeight() {
		return topBarHeight;
	}

	return {
		clear : clear,
        drawTopBar : drawTopBar,
        resizeCanvas : resizeCanvas,
		drawGrid : drawGrid,
		loadTileImages : loadTileImages,
		drawTiles : drawTiles,
		getCellDimensions : getCellDimensions,
		getTopBarHeight : getTopBarHeight
	};
}());
