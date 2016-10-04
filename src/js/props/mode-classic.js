var GameMaster = require('../game/gameMaster');
var WorldProp = require('../worldProp');

module.exports = function(){
	
	
	var bgImage = new WorldProp( bgProps );
	
	//models
	var worldShotgun = new WorldProp( shotgunWorldProps );
	var worldShotgun2 = new WorldProp( shotgunWorldProps );
	var worldPistol = new WorldProp( pistolWorldProps );
	var worldMachineGun = new WorldProp( machineGunWorldProps );
	
	
	//walls
	var topWall = new worldArea( topWallProps );
	var bottomWall = new worldArea( bottomWallProps );
	var leftWall = new worldArea( leftWallProps );
	var rightWall = new worldArea( rightWallProps );
	
	
	//spawns Zombies! 
	var zombieSpawner = new ZombieSpawner();
	
	//camera
	var camera = new Camera();
	
	var gameMasterProps = {
		camera:camera,
		children:[ bgImage, worldShotgun, worldShotgun2, worldMachineGun, worldPistol, topWall, bottomWall,leftWall, rightWall, zombieSpawner ], //hero2   
	};
	
	return new GameMaster( gameMasterProps ); //level Not the World!! 
};