
/* var gamepadSupportAvailable = !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;
console.log(gamepadSupportAvailable); */

var heroControls = {
	
	left:37,
	up:38,
	right:39,
	down:40,
	shoot:32,
	slot0:96,
	slot1:97,
	slot2:98,
	slot3:99,
	slot4:100,
	slot5:101,
}
var hero2Controls = {
	
	left:65,
	up:87,
	right:68,
	down:83,
	shoot:32,
}


	
var heroProps = {
	
	ai:false,
	style:"topDown",
	spriteTorseSrc:"images/bkspr01.png",
	spriteLegsSrc:"images/bkspr01-legs.png",
	frameX:128, //used for sprite clipping
	frameY:128, //used for sprite clipping
	speed:150,
	height:64, //
	width:64,  //
	health:128,
	animations:heroAnimations,
	controls:heroControls,
	
};


var hero2Props = {
	
	ai:false,
	style:"topDown",
	spriteTorseSrc:"images/bkspr01.png",
	spriteLegsSrc:"images/bkspr01-legs.png",
	frameX:128,
	frameY:128,
	speed:150,
	height:64,
	width:64,
	health:128,
	animations:heroAnimations,
	controls:hero2Controls,
	
};