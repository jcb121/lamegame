module.exports = {
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