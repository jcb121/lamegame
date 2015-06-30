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
		collisions:{
			player:function(player){
				
				if(lacksTool(player, "Pistol 1 handed")){

					var pistol1handed = new tool(pistol1handedProps);
					var pistol2handed = new tool(pistol2handedProps);
					
					pistol1handed.parent = player;
					pistol2handed.parent = player;
					
					player.inventory.push( pistol1handed );
					player.inventory.push( pistol2handed );
					
					this.parent.live = false;
				
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
					
					this.parent.live = false; 
					
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
			player:function( player, hitInfo, time ){		

				player.phaseClass();
				
				
				
				if( 0 <= player.key && player.key <= 90 ){			
					player.key += 0.5 * time;
				}
				else if( 90 <= player.key && player.key <=  270 ){
					player.key -= 0.5 * time;		
				}else if( 270 <= player.key && player.key <=  360 ){				
					player.key += 0.5 * time;
					if( player.key < 0) player.key -= 360; 
				}
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
			player:function( player, hi, time ){
				
				player.phaseClass();
				
				if(  0 <= player.key && player.key <= 90 ){
					player.key -= 0.5 * time; 
				}
				else if(  90 <= player.key && player.key <= 180 ){
					player.key += 0.5 * time;
				}
				else if(  180 <= player.key && player.key <= 270 ){
					player.key -= 0.5 * time;
				}
				else if(  270 <= player.key && player.key <= 360 ){
					player.key += 0.5 * time;
				}
				
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
			player:function( player, hi, time ){
				
				player.phaseClass();
					
				if( 90 <= player.key && player.key <= 270 ){								
					player.key += 0.5 * time;
				}
				else if( 270 <= player.key && player.key <=  360 ){			
					player.key -= 0.5 * time;		
				}else if( 0 <= player.key && player.key <=  89 ){				
					player.key -= 0.5 * time;
					if( player.key < 0) player.key += 360; 
				}
			},
		},
	};	
	
	//World Hit Boxes..........	
	var wallCollisions = {
		player:staticCollide,
		bullet:killCollide,
	}
	
	var topWallProps = {
		x:2560/2,
		y:-5,
		height:20,
		width:2560,
		bearing:0,
		solid:true,
		collisions:wallCollisions,
	};
	
	var bottomWallProps = {
		x:2560/2,
		y:1398,
		height:20,
		width:2560,
		bearing:0,
		solid:true,
		collisions:wallCollisions,
	};
	
	var leftWallProps = {
		x:-5,
		y:1398/2,
		height:1398,
		width:20,
		bearing:0,
		solid:true,
		collisions:wallCollisions,
	};
	
	var rightWallProps = {
		x:2565,
		y:1398/2,
		height:1398,
		width:20,
		bearing:0,
		solid:true,
		collisions:wallCollisions,
	};
	

	