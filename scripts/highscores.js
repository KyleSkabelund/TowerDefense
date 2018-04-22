MyGame.screens['high-scores'] = (function(game) {
    'use strict';
	
	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { game.showScreen('main-menu'); });
    }

    var highScores = null;
    
    socket.on('refresh high scores', function(data) {
        highScores = data;
    });
	
	function run() {
        if(highScores == null) {
            document.getElementById('high-score-content').innerHTML = '<li>No High Scores</li>';
            return;
        }

		document.getElementById('high-score-content').innerHTML = '';
		
		highScores.serverScores.sort(function (a, b) {
  			return b.score - a.score;
		});
		for(var ii = 0; ii < highScores.serverScores.length; ++ii)
		{
			if(ii < 10) {
				document.getElementById('high-score-content').innerHTML += '<li>' + highScores.serverScores[ii].name + ': ' + highScores.serverScores[ii].score + '</li>';
			}
		}
	}
	
	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game));