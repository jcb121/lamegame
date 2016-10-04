module.exports = function(canvas){
	
	var mainMenuProps = require('./menu1');
	var MouseObject = require('../mouse');
	var mouse = new MouseObject(canvas);
	mainMenuProps.mouse = mouse;
	
	var MenuScreen = require('../menuScreen/menu');
	return new MenuScreen(mainMenuProps);
	
};