var heroAnimations = require('./animations');
var dynamicCollide = require('../../functions/collisions').dynamicCollide;

var PlayerCollisions = {	
	player:dynamicCollide,
	AiPlayer:dynamicCollide,
	bullet:function(){
		
	},
};

module.export = {
	solid:true,
	spriteTorseSrc:'images/bkspr01.png',
	spriteLegsSrc:'images/bkspr02-legs.png',
	frameX:128, //used for sprite clipping
	frameY:128, //used for sprite clipping
	speed:128,
	height:64, //
	width:64,  //
	health:128,
	animations:heroAnimations,
	collisions:PlayerCollisions,
};