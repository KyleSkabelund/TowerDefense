MyGame.screens['settings'] = (function(game) {
    var configButtons = {};
    var configSelectedButton =[];
    var keyChange;
    var interval;
    var defaultUpgradeKey = 'u';
    var defaultSellKey = 's';
    var defaultStartKey = 't';

	'use strict';
	function initialize() {
		document.getElementById('id-settings-back').addEventListener(
			'click',
            function() { game.showScreen('main-menu'); });
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
    function changeShortcutClick(selectedButton){

        if(configSelectedButton.disabled == true)
        {
            resetButtons();
        }
        configSelectedButton = selectedButton;
        if(keyChange === undefined ) keyChange = configSelectedButton.innerHTML;
        configSelectedButton.innerHTML = keyChange;
        interval = setInterval(function(){
            configSelectedButton.innerHTML = configSelectedButton.innerHTML == "__" ? keyChange : "__";
        },500)
        
        configSelectedButton.disabled = true;
        configSelectedButton.className = "config-button-clicked";
    }
    function saveLocalStorageDefaults(){
        if(localStorage[upGradeButton.id] == undefined) localStorage.setItem(upGradeButton.id,defaultUpgradeKey.charCodeAt(0))
        if(localStorage[sellButton.id] == undefined) localStorage.setItem(sellButton.id, defaultSellKey.charCodeAt(0))
        if(localStorage[startButton.id] == undefined) localStorage.setItem(startButton.id, defaultStartKey.charCodeAt(0))
    }
    function setupOptions(){
        

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