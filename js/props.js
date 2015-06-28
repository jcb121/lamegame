	var pistolWorldProps = {
		image:"images/pistolWorld.png",
		width:32,
		height:32,
		bearing:45,
		collectable:true,
		collisions:{
			player:function(player){
				
				var pistol1handed = new tool(pistol1handedProps);
				var pistol2handed = new tool(pistol2handedProps);
				
				pistol1handed.parent = player;
				pistol2handed.parent = player;
				
				player.inventory.push( pistol1handed );
				player.inventory.push( pistol2handed );
			}
		},
	};
	
	var shotgunWorldProps = {
		image:"images/shotgunWorld.png",
		width:64,
		height:20,
		collectable:true,
		collisions:{
			player:function(player){
				
				var shotgun = new tool(shotGunProps);	
				shotgun.parent = player;
				player.inventory.push( shotgun );
			}
		},
	};
	
	var tankAreaProps = {
		x: canvas.width/8 /2,
		y: canvas.height/8 /2,
		width: canvas.width/8,
		height:canvas.height/8,
		bearing:0,
		collisions:{
			player:function( player ){				
				player.incSize();
				player.incToughness();
				player.decSpeed();
			},
		},
	};
	
	var rocketAreaProps = {
		x: canvas.width - canvas.width/8 /2,
		y: canvas.height/8 /2,
		width:canvas.width/8,
		height:canvas.height/8,
		bearing:0,
		collisions:{
			player:function( player ){
				
				player.incToughness();
				player.incSpeed();
				player.incSize();
				
			},
		},
	};
	
	var scoutAreaProps = {
		x: canvas.width - canvas.width/8 /2,
		y: canvas.height - canvas.height/8 /2,
		width:canvas.width/8,
		height:canvas.height/8,
		bearing:0,
		collisions:{
			player:function( player ){
				
				player.incSpeed();
				player.decSize();
				player.deccToughness
				
			},
		},
	};	
	
	