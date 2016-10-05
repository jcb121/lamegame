var GameMaster = require('../game/gameMaster');
var WorldProp = require('../worldProp');
var WorldArea = require('../game/worldArea');
var Camera = require('../game/camera');
var ZombieSpawner = require('../game/zombieSpawner');

var mapConf = require('./road');
var shotgunWorldProps = ('./props/shotgun');
var pistolWorldProps = ('./props/pistol');
var machineGunWorldProps = ('./props/machineGun');



module.exports = function(){

	var children = [];
	children.push(new WorldProp(mapConf));
	mapConf.walls.forEach(function(wall){
		//children.push(new WorldArea(wall));
	});

	//children.push(new WorldProp( shotgunWorldProps));
	//children.push(new WorldProp( shotgunWorldProps));
	//children.push(new WorldProp( pistolWorldProps));
	//children.push(new WorldProp( machineGunWorldProps));
	children.push(new ZombieSpawner());

	//camera
	var camera = new Camera();

	return new GameMaster({camera,children});
};