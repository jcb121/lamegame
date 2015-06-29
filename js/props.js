	var pistolWorldProps = {
		name:"Pistol 1 handed",
		image:"images/pistolWorld.png",
		width:32,
		height:32,
		bearing:45,
		collectable:true,
		collisions:{
			player:function(player){
				
				if(lacksTool(player, "Pistol 1 handed")){

					var pistol1handed = new tool(pistol1handedProps);
					var pistol2handed = new tool(pistol2handedProps);
					
					pistol1handed.parent = player;
					pistol2handed.parent = player;
					
					player.inventory.push( pistol1handed );
					player.inventory.push( pistol2handed );
				
				}				
			}
		},
	};
	
	
	
	var shotgunWorldProps = {
		name:"Shotgun",
		image:"images/shotgunWorld.png",
		width:64,
		height:20,
		collectable:true,
		collisions:{
			player:function(player){					
					
				if(lacksTool(player, "Shotgun")){
					
					var shotgun = new tool(shotGunProps);	
					shotgun.parent = player;
					player.inventory.push( shotgun );
					
					this.parent.live = false; //does work here!!!
					
				}
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
	
	//World Hit Boxes..........
	
	var topWallProps = {
		x:2560/2,
		y:-5,
		height:20,
		width:2560,
		bearing:0,
		solid:true,
		collisions:{
			player:function( player, hitInfo ){
				
				player.x += hitInfo.overlapV.x;
				player.y += hitInfo.overlapV.y;
			
			},
			bullet:function( bullet ){
				bullet.live = false;
			},
		},
	};
	
	var bottomWallProps = {
		x:2560/2,
		y:1398,
		height:20,
		width:2560,
		bearing:0,
		solid:true,
		collisions:{
			player:function( player, hitInfo ){
				
				player.x += hitInfo.overlapV.x;
				player.y += hitInfo.overlapV.y;
			
			},
			bullet:function( bullet ){
				bullet.live = false;
			},
		},
	};
	
	var leftWallProps = {
		x:-5,
		y:1398/2,
		height:1398,
		width:20,
		bearing:0,
		solid:true,
		collisions:{
			player:function( player, hitInfo ){
				
				player.x += hitInfo.overlapV.x;
				player.y += hitInfo.overlapV.y;
			
			},
			bullet:function( bullet ){
				bullet.live = false;
			},
		},
	};
	
	var rightWallProps = {
		x:2565,
		y:1398/2,
		height:1398,
		width:20,
		bearing:0,
		solid:true,
		collisions:{
			player:function( player, hitInfo ){
				
				player.x += hitInfo.overlapV.x;
				player.y += hitInfo.overlapV.y;
			
			},
			bullet:function( bullet ){
				bullet.live = false;
			},
		},
	};
	