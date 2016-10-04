var bgProps = {
	image:'images/map1.png',
	x:0,
	y:0,
	bearing:0,
};

//World Hit Boxes..........	
var wallCollisions = {
	player:staticCollide,
	AiPlayer:reflectCollide,
	bullet:killCollide,
}

var topWallProps = {
	x:2560/2,
	y:-250,
	height:500,
	width:3560,
	bearing:0,
	solid:true,
	collisions:wallCollisions,
};

var bottomWallProps = {
	x:2560/2,
	y:1643,
	height:500,
	width:3560,
	bearing:0,
	solid:true,
	collisions:wallCollisions,
};

var leftWallProps = {
	x:-250,
	y:1398/2,
	height:1398,
	width:500,
	bearing:0,
	solid:true,
	collisions:wallCollisions,
};

var rightWallProps = {
	x:2810,
	y:1398/2,
	height:1398,
	width:500,
	bearing:0,
	solid:true,
	collisions:wallCollisions,
};

module.exports = {
	background:bgProps,
	walls:[rightWallProps, leftWallProps, topWallProps, bottomWallProps]
};
	