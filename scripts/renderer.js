// ------------------------------------------------------------------
//
//
// ------------------------------------------------------------------

MyGame.graphics = (function() {
	'use strict';
	
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
		context.stroke();
	}

    
	
	
	

	return {
		clear : clear,
        drawTopBar : drawTopBar,
        resizeCanvas : resizeCanvas,
		drawGrid : drawGrid
	};
}());
