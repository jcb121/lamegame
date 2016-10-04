module.exports = {
	
	animation:"oneHanded",
	name:"Pistol 1 handed",
	gunHeldSrc:"images/pistol.png",
	
	fireSound: { volume:1, src: "sounds/9MM_Luger_p08_semi_automatic_single_shot_pistol_BLASTWAVEFX_09388.mp3" },
	startSound: { volume:0.5, src: "sounds/Gun_cock_04_SFXBible_ss06662.mp3" } ,
	
	xOffset:10, //in use
	yOffset:-30, //in use
	width:3, //in use
	height:15, //in use
	bulletOffsetX:11, //in use
	bulletOffsetY:-35, //in use
	hands:1, //in use
	weight:1.2, //in use
	
	
	useRate: 5,  //in use	
	
	ammo:50,
	clip: 10,
	reloadTime: 2,
	
	
	accuracy:15, //in degrees.
	bulletsPerFire:1,
	bulletSpread:1, //spread in degree
	bulletSpeed:1024,
	bulletSize:3,
};