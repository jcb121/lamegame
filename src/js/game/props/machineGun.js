module.exports = {
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