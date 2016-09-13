var pistol1handedProps = {
	
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

var pistol2handedProps = {
	
	animation:"twoHanded",
	name:"Pistol 2 handed",
	
	fireSound: { volume:1, src: "sounds/9MM_Luger_p08_semi_automatic_single_shot_pistol_BLASTWAVEFX_09388.mp3" },
	startSound: { volume:0.5, src: "sounds/Gun_cock_04_SFXBible_ss06662.mp3" } ,
	
	gunHeldSrc:"images/pistol.png",
	useRate:6,
	xOffset:-1,
	yOffset:-30,
	width:3,
	height:15,
	bulletOffsetX:0,
	bulletOffsetY:-31,
	
	ammo:50,
	clip: 10,
	reloadTime: 2,
	
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
	
	fireSound: { volume:1, src: "sounds/12_gauge_SPAS-12_shotgun_single_shot_close_perspective_05_SFXBible_ss06854.mp3" },
	startSound: { volume:0.5, src: "sounds/Shotgun_cock_movement_BLASTWAVEFX_09296.mp3" } ,
	
	gunHeldSrc:"images/pistol.png",
	xOffset:3,
	yOffset:-37,
	width:5,
	height:30,
	bulletOffsetX:5,
	bulletOffsetY:-37,
	
	hands:2,
	weight:2,
	useRate:2,
	
	ammo:50,
	clip: 6,
	reloadTime: 4,
	
	accuracy:3, //in degrees.
	bulletsPerFire:6, //spread in degrees.
	bulletSpread:10,
	bulletSpeed:1024,
	bulletSize:3,
};

var machineGunProps = {
	
	animation:"twoHandedB",
	name:"Machine Gun",
	
	fireSound: { volume:1, src: "sounds/M60_machine_gun_single_shot_close_perspective_01_SFXBible_ss06806.mp3" },
	startSound: { volume:0.5, src: "sounds/Shotgun_cock_movement_BLASTWAVEFX_09296.mp3" } ,
	
	gunHeldSrc:"images/pistol.png",
	xOffset:3,
	yOffset:-37,
	width:5,
	height:30,
	bulletOffsetX:5,
	bulletOffsetY:-37,
	
	hands:2,
	weight:2,
	useRate:20,
	
	ammo:500,
	clip:100,
	reloadTime:5,
	
	accuracy:5, //in degrees.
	bulletSpeed:1024,
	bulletSize:3,
};


