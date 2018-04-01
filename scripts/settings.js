MyGame.screens['settings'] = (function(game) {
    var configButtons = {};
    var configSelectedButton =[];
    var keyChange;
    var interval;
    var defaultUpgradeKey = 'u';
    var defaultSellKey = 's';
    var defaultStartKey = 'g';

	'use strict';
	function initialize() {
		document.getElementById('id-settings-back').addEventListener(
			'click',
            function() { game.showScreen('main-menu'); });
        document.getElementById('id-settings-save').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });

            gridPlacement = document.getElementById('grid-placement')
            showTowerCoverage = document.getElementById('show-tower-coverage')
            showCreepPath = document.getElementById('show-creep-path')

            gridPlacement.addEventListener('click',function(){turnOnOff(gridPlacement)});
            showTowerCoverage.addEventListener('click',function(){turnOnOff(showTowerCoverage)});
            showCreepPath.addEventListener('click',function(){turnOnOff(showCreepPath)});
            
            upGradeButton = document.getElementById('upgrade-tower-config');
            sellButton = document.getElementById('sell-tower-config');
            startButton = document.getElementById('start-level-config');

            saveLocalStorageDefaults();
            setupOptions();

            upGradeButton.addEventListener('click', function() {changeShortcutClick(upGradeButton)});
            sellButton.addEventListener('click', function() {changeShortcutClick(sellButton)});
            startButton.addEventListener('click', function() {changeShortcutClick(startButton)});

            document.addEventListener("keydown", getKey);
	}
	
	function run() {

    }
    
    function getKey(e){
        if(configSelectedButton.disabled == true){
            keyChange = e.key;
            configSelectedButton.innerHTML = keyChange.toLowerCase();
            localStorage.setItem(configSelectedButton.id, e.keyCode);
            resetButtons();
        }
    }
    function turnOnOff(gameSettingsSelectedButton)
    {
        if(configSelectedButton.disabled == true)
        {
            resetButtons();
        }
        gameSettingsSelectedButton.innerHTML = gameSettingsSelectedButton.innerHTML == "on" ? "off" : "on";
        localStorage.setItem(gameSettingsSelectedButton.id,gameSettingsSelectedButton.innerHTML);
    }
    function changeShortcutClick(selectedButton){

        if(configSelectedButton.disabled == true)
        {
            resetButtons();
        }
        configSelectedButton = selectedButton;
        if(keyChange === undefined ) keyChange = configSelectedButton.innerHTML;
        configSelectedButton.innerHTML = keyChange;
        interval = setInterval(function(){
            configSelectedButton.innerHTML = configSelectedButton.innerHTML == "_" ? keyChange : "_";
        },500)
        
        configSelectedButton.disabled = true;
        configSelectedButton.className = "config-button-clicked";
    }
    function saveLocalStorageDefaults(){
        if(localStorage[gridPlacement.id] == undefined) localStorage.setItem(gridPlacement.id,"off")
        if(localStorage[showTowerCoverage.id] == undefined) localStorage.setItem(showTowerCoverage.id, "off")
        if(localStorage[showCreepPath.id] == undefined) localStorage.setItem(showCreepPath.id, "off")

        if(localStorage[upGradeButton.id] == undefined) localStorage.setItem(upGradeButton.id,defaultUpgradeKey.charCodeAt(0))
        if(localStorage[sellButton.id] == undefined) localStorage.setItem(sellButton.id, defaultSellKey.charCodeAt(0))
        if(localStorage[startButton.id] == undefined) localStorage.setItem(startButton.id, defaultStartKey.charCodeAt(0))
    }
    function setupOptions(){
        gridPlacement.innerHTML = localStorage[gridPlacement.id];
        showTowerCoverage.innerHTML = localStorage[showTowerCoverage.id];
        showCreepPath.innerHTML = localStorage[showCreepPath.id];

        upGradeButton.innerHTML =  String.fromCharCode(localStorage[upGradeButton.id]).toLocaleLowerCase();
        sellButton.innerHTML =  String.fromCharCode(localStorage[sellButton.id]).toLocaleLowerCase();
        startButton.innerHTML = String.fromCharCode(localStorage[startButton.id]).toLocaleLowerCase();
    }
    function resetButtons(){
        configSelectedButton.className = "config-button";
        configSelectedButton.disabled = false;
        configSelectedButton.innerHTML = keyChange;
        clearInterval(interval);
        keyChange = undefined;
    }


	return {
		initialize : initialize,
		run : run
	};
}(MyGame.game));