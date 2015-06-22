function player(properties){
	
	for (var attrname in properties) { 
		this[attrname] = properties[attrname]; 
	}	
	
	this.hitboxCords = [];
	
	//SET FORGET ==================================================
	

	//sprite sheets.
	this.image = new Image();
	this.image2 = new Image();
		
	this.image.src = properties.spriteTorseSrc;
	this.image2.src = properties.spriteLegsSrc;
	
	//check if animation has changed
	this.frameChange = false;

	//player location in the world
	this.x = 0;
	this.y = 0;
	//player location in the world
	this.centerX;
	this.centerY;
			
	this.ready = false;
	this.ready2 = false;
	
	this.start = function(){
		if(this.ready){
			
			this.x = canvas.width/2 - this.width/2;
			this.y = canvas.height/2 - this.height/2;	
								
			return true;
		}else{
			return false;
		}
	}
	
	this.startRand = function(){
		if(this.ready){
			this.x = 32 + (Math.random() * (canvas.width - 64));
			this.y = 32 + (Math.random() * (canvas.height - 64));		
		}	
	}
	
	var obj = {
		player:this,
	};
	
	this.image.onload = function(){	
		obj.image = this;
		(function(that){
			
			that.player.ready = true;	
		})(obj);
	};
	this.image2.onload = function(){	
		obj.image = this;
		(function(that){
			
			that.player.ready2 = true;	
		})(obj);
	};
	
	//IMPORTANT==================================================

	
	
	
	this.currentTool;
	
	//directions of each layer
	this.direction = {
		"0":0,
		"1":0,
		"2":0,
	};
	//what the player is doing
	this.state = {
		"0":"standing",
		"1":"standing",
		"2":"standing",
	}
	//the current timer of the frame
	var layerFrameTime = {
		"0":0,
		"1":0,
		"2":0,
	};
	//the current frame of animation
	var layerCurrentFrame = {
		"0":0,
		"1":0,
		"2":0,
	};
	//how long each frame lasts
	var layerEachFrameTime = {
		"0":0,
		"1":0,
		"2":0,
	};
	
	
	//holds the xy cords on the sprite sheet
	this.currentFrames = {
		layer0:{
			x:0,
			y:0
		},
		layer1:{
			x:0,
			y:0
		},
		layer2:{
			x:0,
			y:0
		},
	}
	
	this.collide = function( obj ){
		if( obj.__proto__.constructor.name == "player" ){ //works
			//hits another player.. ai?
		}
		if( obj.__proto__.constructor.name == "bullet" ){ //works
			
			console.log("set false");
			obj.live = false;
			
		}
		
	};
	
	this.chooseFrame = function(time){
		
		//syncronize two later animations!
		if( this.state[0] == this.state[1]){
			layerFrameTime[1] =  layerFrameTime[0];
			layerCurrentFrame[1] = layerCurrentFrame[0];
		}
		
		//var animation = this.animations[state];
		
		time *=1000;
		for (i = 0; i < 2; i++) { 
			
			
			var animation = this.animations[ this.state[i] ];
		
			layerEachFrameTime[i] = animation["layerTime" + i];
			if (layerFrameTime[i] > layerEachFrameTime[i] || this.frameChange == true){
				//get next frame
				
				layerFrameTime[i] = 0; 
				
				
				if(layerCurrentFrame[i] > animation["layer"+i].length -2){
					
					layerCurrentFrame[i] = 0;				
					this.currentFrames["layer" + i].x = animation["layer" + i][ layerCurrentFrame[i] ][1]
					this.currentFrames["layer" + i].y = animation["layer" + i][ layerCurrentFrame[i] ][0]
					
				}else{	
				
					layerCurrentFrame[i]++;				
					
					this.currentFrames["layer" + i].x = animation["layer" + i][ layerCurrentFrame[i] ][1]
					this.currentFrames["layer" + i].y = animation["layer" + i][ layerCurrentFrame[i] ][0]
						
				}
			}else{
					layerFrameTime[i] += time;
			}
			

		};		
	};
	
	this.update = function(modifier){
		
		var time = modifier;
		this.centerX =  this.x + this.width/2;
		this.centerY = this.y + this.height/2;

		var hands = 0;
		
		if ( this.currentTool !== undefined) { 
			
			this.currentTool.update(time);
			modifier = modifier / this.currentTool.weight;
			hands = this.currentTool.hands;
		}
				
		var moving = 0;
		var angle = 0;		
		
		if (this.controls.left in keysDown) { // Player holding left
				
			var travel = this.speed * modifier;
			this.x -= travel;
			this.centerX =  this.x + this.width/2;
						
			angle += 270;
			moving++;	
		}
		if (this.controls.down in keysDown) { // Player holding down
						
			var travel = this.speed * modifier;
			this.y += travel;
			this.centerY = this.y + this.height/2;	
			
			angle += 180; //pointing down!			
			moving++;
		}
		if (this.controls.right in keysDown) { // Player holding right
			
				
			var travel = this.speed * modifier;
			this.x += travel;
			this.centerX = this.x + this.width/2;	
			
			angle += 90; //pointing down!	
			moving++;
		}
		if (this.controls.up in keysDown) { // Player holding up
				
			var travel = this.speed * modifier;
			this.y -= travel;
			this.centerY = this.y + this.height/2;
			
			angle -= 360; //keep pointing up!	
			moving++;
		}		
		if( this.controls.slot0 in keysDown){	//num1
			console.log("puts guns away pistol");
			this.currentTool = undefined;
		}
		if( this.controls.slot1 in keysDown){	//num1
			console.log("pulls out a 1 handed pistol");
			this.currentTool = pistol1handed;	
		}
		if( this.controls.slot2 in keysDown){	//num2
			console.log("pulls out a 2 handed pistol");
			this.currentTool = pistol2handed;
		}
		if( this.controls.slot3 in keysDown){	//num2
			console.log("pulls out a shotgun");
			this.currentTool = shotgun;
		}		
		if (this.controls.shoot in keysDown) { // space /	shoot!	
			
			if ( this.currentTool !== undefined) { 
				this.currentTool.fire(time);
			}
			
		}
		
		
		// vars above are currentTool, angle and moving.....
		
		if(moving > 0){ //USER IS MOVING
			
			//fixes the angle issue....
			if(moving > 1){			
				angle = angle/moving;

				if(angle == -135){				
					angle += 180;	
				}
				if(angle == -45){
					angle += 360;	
				}
				
			}else{
				
				if(angle == -360){
					angle = 0;
				} 
			}
			
			this.direction["0"] = angle;
			this.direction["1"] = angle;
			
			this.state["0"] = "walking";
			this.state["1"] = "walking";
			
		}else{ //USER IS STANDING....
			
			this.state["0"] = "standing";
			this.state["1"] = "standing";
		}	
		
		//weapon always overwrites standing....
		if( this.currentTool !== undefined ){		
			this.state["1"] = this.currentTool.animation;
		}
				
		//hit boxes are on layer 1!
		//
		
		
		//------------------------------------------------------------
		
		var hitBoxes = this.animations[ this.state[1] ].hitBoxes;

		this.hitboxCords = [ //array of all cords
			//box
			[ 
				rotate( this.centerX + hitBoxes[0][0].x , this.centerY + hitBoxes[0][0].y , this.centerX , this.centerY , this.direction["1"] ),
				rotate( this.centerX + hitBoxes[0][0].x , this.centerY + hitBoxes[0][1].y , this.centerX , this.centerY , this.direction["1"] ),
				rotate( this.centerX + hitBoxes[0][1].x , this.centerY + hitBoxes[0][1].y , this.centerX , this.centerY , this.direction["1"] ),
				rotate( this.centerX + hitBoxes[0][1].x , this.centerY + hitBoxes[0][0].y , this.centerX , this.centerY , this.direction["1"] ),
			],
			//box
			[ 
				rotate( this.centerX + hitBoxes[1][0].x , this.centerY + hitBoxes[1][0].y , this.centerX , this.centerY , this.direction["1"] ),
				rotate( this.centerX + hitBoxes[1][0].x , this.centerY + hitBoxes[1][1].y , this.centerX , this.centerY , this.direction["1"] ),
				rotate( this.centerX + hitBoxes[1][1].x , this.centerY + hitBoxes[1][1].y , this.centerX , this.centerY , this.direction["1"] ),
				rotate( this.centerX + hitBoxes[1][1].x , this.centerY + hitBoxes[1][0].y , this.centerX , this.centerY , this.direction["1"] ),
			],
			//box
			[ 
				rotate( this.centerX + hitBoxes[2][0].x , this.centerY + hitBoxes[2][0].y , this.centerX , this.centerY , this.direction["1"] ),
				rotate( this.centerX + hitBoxes[2][0].x , this.centerY + hitBoxes[2][1].y , this.centerX , this.centerY , this.direction["1"] ),
				rotate( this.centerX + hitBoxes[2][1].x , this.centerY + hitBoxes[2][1].y , this.centerX , this.centerY , this.direction["1"] ),
				rotate( this.centerX + hitBoxes[2][1].x , this.centerY + hitBoxes[2][0].y , this.centerX , this.centerY , this.direction["1"] ),
			],
		]; 
		
		this.chooseFrame( time );

	};
	
	this.gotoPlayer = function(){
		ctx.save();
		ctx.translate(this.centerX, this.centerY);
	}
	
	this.draw = function(){	
		if (this.ready && this.ready2) {

				this.gotoPlayer();
								
				//save the layer at the player.
				ctx.save();	
			
				//layer 0
				
		
				
				ctx.rotate( this.direction["0"] * Math.PI/180);
				ctx.drawImage( this.image2,	this.frameX * (this.currentFrames.layer0.y - 1),this.frameY * (this.currentFrames.layer0.x - 1), this.frameX, this.frameY, -this.width/2, -this.height/2, this.width, this.height);
	
				ctx.restore();
							
				//  LAYER 1
				ctx.rotate( this.direction["1"] * Math.PI/180);
				ctx.drawImage(this.image, this.frameX * (this.currentFrames.layer1.y - 1), this.frameY * (this.currentFrames.layer1.x - 1), this.frameX,this.frameY, -this.width/2, -this.height/2 ,this.width,this.height);
							
				// tool acs as another layer
				if ( this.currentTool !== undefined) { 
					this.currentTool.draw();
				}
				
				//back to original canvas layer			
				ctx.restore();		
		}
	}
	
	this.drawCords = function(){
		ctx.fillText( "player.x:" + this.x + " player.y:" + this.y,50,50);	
	}

};