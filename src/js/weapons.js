var pistol1handedProps = {
	
	animation:"oneHanded",
	name:"Pistol 1 handed",
	gunHeldSrc:"images/pistol.png",
	
	fireSound: pistolSound,
	startSound: pistolCockSound ,
	
	xOffset:10, //in use
	yOffset:-30, //in use
	width:3, //in use
	height:15, //in use
	bulletOffsetX:11, //in use
	bulletOffsetY:-35, //in use
	hands:1, //in use
	weight:1.2, //in use
	useRate: 5,  //in use	
	
	accuracy:15, //in degrees.
	
	bulletsPerFire:1, //spread in degrees.
	bulletSpread:1,
	bulletSpeed:1024,
	bulletSize:3,
};

var pistol2handedProps = {
	
	animation:"twoHanded",
	name:"Pistol 2 handed",
	
	fireSound: pistolSound,
	startSound: pistolCockSound ,
	
	gunHeldSrc:"images/pistol.png",
	useRate:6,
	xOffset:-1,
	yOffset:-30,
	width:3,
	height:15,
	bulletOffsetX:0,
	bulletOffsetY:-31,
	
	hands:2,
	weight:2,
	
	accuracy:2,
	bulletSpread:1,
	bulletSpeed:1024,	
	bulletsPerFire:1,
	bulletSize:3,
	
	
};

var shotGunProps = {
	
	animation:"twoHandedB",
	name:"Shotgun",
	
	fireSound: shotGunSound,
	startSound: shotgunCockSound ,
	
	gunHeldSrc:"images/pistol.png",
	xOffset:3,
	yOffset:-37,
	width:5,
	height:30,
	bulletOffsetX:5,
	bulletOffsetY:-37,
	
	hands:2,
	weight:2,
	useRate:1,
	
	accuracy:3, //in degrees.
	
	bulletsPerFire:6, //spread in degrees.
	bulletSpread:10,
	bulletSpeed:1024,
	bulletSize:4,
};

