// ------------------------------------------------------------------
//
//
// ------------------------------------------------------------------

MyGame.graphics = (function() {
	'use strict';
	
	var canvas = document.getElementById('canvas-main'),
		context = canvas.getContext('2d'),
        startTime = new Date();

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
        let barHeight = 25;
        let standardFont = '16px';
        let fontFill = 'rgba(0, 0, 0, 0.7)';

		context.fillRect(0, 0, canvas.width, barHeight);
        
        let currTime = new Date();
        let timeDifference = currTime - startTime;
        timeDifference /= 1000;
        drawText(standardFont, 10, 16, 'Elapsed Time: ' + timeDifference, fontFill);
    }

    //drawText('16px', 10, 10, 'message', 'black')
    function drawText(fontSize, x, y, message, fill) {
        context.fillStyle = fill;
		context.font = fontSize + ' Arial';
        context.fillText(message, x, y);
	}

    
	
	
	

	return {
		clear : clear,
        drawTopBar : drawTopBar,
        resizeCanvas : resizeCanvas
	};
}());
