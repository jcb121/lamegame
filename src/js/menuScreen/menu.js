var checkReady = require('../functions/checkReady');
var worldProp = require('../worldProp');
var MenuItem = require('./menuItem');
var getCollisions = require('../functions/getCollisions');
function MenuScreen(props ){
	this.type = 'menuScreen';
	
	this.children = [];
	
	var menuBg = {
		image:props.image,
		x:0,
		y:0,
		bearing:0,
	};
	
	this.children.push( new worldProp( menuBg ) ); //background
	props.items.forEach(function(item){
		let menuItem = new MenuItem(item);
		menuItem.parent = this;
		this.children.push(menuItem);
	}.bind(this));
	
	this.children.push(props.mouse);
}

MenuScreen.prototype = {
	setMode:function(mode){
		this.parent.setMode(mode);
	},
	update:function( modifier ){ 
		
		if( this.ready ){
			
			for( var i = 0; i < this.children.length; i++){
			
				if( this.children[i].live == false){
					this.children.splice(i,1);
					continue;
				}
				this.children[i].update( modifier );
			}
			getCollisions(this.children);
			
			
			
		}
		else{
			this.checkReady( modifier ); //updates also
		}
	},
	draw:function(canvas){
		if( this.ready ){
			for( var i = 0; i < this.children.length; i++){
				this.children[i].draw(canvas);
			}
		}
	},
	checkReady,
};

module.exports = MenuScreen;