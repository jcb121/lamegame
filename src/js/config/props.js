	var bgProps = {
		image:"images/map1.png",
		x:0,
		y:0,
		bearing:0,
	}
	
	var pistolWorldProps = {
		name:"Pistol 1 handed",
		image:"images/pistolWorld.png",
		width:32,
		height:32,
		bearing:45,
		collectable:true,
		spawns:[ pistol1handedProps, pistol2handedProps ],
		collisions:{
			player:function(player){
				
				this.parent.giveToPlayer( player );

			}
		},
	};
	
	
	
	var shotgunWorldProps = {
		name:"Shotgun",
		image:"images/shotgunWorld.png",
		width:64,
		height:20,
		collectable:true,
		spawns:[shotGunProps],
		collisions:{
			player:function(player){					
				
				this.parent.giveToPlayer( player );
				
			}
		},
	};
	
	var machineGunWorldProps = {
		name:"Machine Gun",
		image:"images/M60tcm2246549.png",
		width:64,
		height:20,
		collectable:true,
		spawns:[ machineGunProps ],
		collisions:{
			player:function(player){					
							
				this.parent.giveToPlayer( player );
				
			}
		},
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
	

	