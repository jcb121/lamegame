var mainMenuProps = require('./menu1');
var MouseObject = require('../mouse');
var checkReady = require('../functions/checkReady');
var worldProp = require('../worldProp');
var MenuItem = require('../menuItem');
var menuConfig = require('./menu1.json');
var getCollisions = require('../functions/getCollisions');

class MainMenu{
	constructor(canvas){
		this.type = 'menuScreen';

		var menuBg = {
			image:menuConfig.image,
			x:0,
			y:0,
			bearing:0,
		};

		var background = new worldProp( menuBg );
		background.parent = this;

		this.children = [background];
		menuConfig.items.forEach(function(item){
			let menuItem = new MenuItem(item);
			menuItem.parent = this;
			this.children.push(menuItem);
		}.bind(this));

		var mouse = new MouseObject(canvas);
		mouse.parent = this;
		this.children.push(mouse);

	}
	update(delta){
		if( this.ready ){
			for( var i = 0; i < this.children.length; i++){
				this.children[i].update(delta);
			}
			getCollisions(this.children);
		}
		else{
			this.checkReady(delta); //updates also
		}
	}
	draw(canvas){
		if( this.ready ){
			for( var i = 0; i < this.children.length; i++){
				this.children[i].draw(canvas);
			}
		}
	}
	setMode(mode){
		this.parent.setMode(mode);
	}
}
MainMenu.prototype.checkReady = checkReady;

module.exports = MainMenu;
/*
* update:function(){
 var allPads = navigator.getGamepads();
 var pads = [];
 for( var i = 0; i< allPads.length; i++){
 if(allPads[i] != undefined) pads.push( allPads[i] );

 }
 this.playerCount = pads.length;
 this.text = this.playerCount;
 //console.log(this);
 return pads.length;
 }
 */