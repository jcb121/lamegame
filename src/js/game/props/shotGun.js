module.exports = {
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