function player(properties){
			
	for (var attrname in properties) { 
		this[attrname] = properties[attrname]; 
	}	
	
	this.collisions = {};
	
	for (var attrname in properties.collisions) { 
		this.collisions[attrname] = properties.collisions[attrname]; 
	}
	this.collisions.parent = this;	
	
	this.type = "player";
	
	this.scale = 1; 
	
	this.switchWeaponDelay = new deBounce( 0.2 );
	
	this.bearing = [];
	this.startRand(); //start the player
	
	this.currentTool = 0; //index
	if( this.inventory == undefined ){
		this.inventory = [undefined];
	}else{
		this.inventory.unshift(undefined);
	}	

	//sprite sheets.
	this.image = new Image();
	this.image2 = new Image();
		
	this.image.src = properties.spriteTorseSrc;
	this.image2.src = properties.spriteLegsSrc;
	
	//check if animation has changed
	this.frameChange = false; //probably use this?
	
	var imgLoad = function(){
		if( this.ready == false){
				this.ready = true;
			}else{
				this.ready = false;			
			};	
	};

	this.image.onload = imgLoad.bind(this)();
	this.image2.onload = imgLoad.bind(this)();
		

	//what the player is doing
	this.state = {}
	//the current timer of the frame
	this.layerFrameTime = {	};
	//the current frame of animation
	this.layerCurrentFrame = {	};
	//how long each frame lasts
	this.layerEachFrameTime = {};
	//holds the xy cords on the sprite sheet
	this.currentFrames = {
		layer0:{},
		layer1:{},
		layer2:{},
	}
};

player.prototype = {
	
	
	update:function(modifier){
		if(  this.ready == undefined || this.ready == false ) return false;
				
		this.switchWeaponDelay.update( modifier );
		
		var time = modifier;
		var currentTool = this.inventory[ this.currentTool ];
		var hands = 0;
		
		if ( currentTool !== undefined) { 			
			currentTool.update(time);
			modifier = modifier / currentTool.weight;
			hands = currentTool.hands;
		}
			
		this.travel = this.speed * modifier;
		
		var pad = navigator.getGamepads();	
		pad = pad[ this.controllerIndex ];
		
		if( pad != undefined ){ //has controller
		
			if( pad.buttons[5].pressed){	
			
				if( this.switchWeaponDelay.ready() ){

					if( this.currentTool < this.inventory.length -1 ){	
						this.currentTool++;	
					}else{	
						this.currentTool = 0;
					}
					
					if( this.inventory[this.currentTool] != undefined ) this.inventory[ this.currentTool ].startSound.play();
					
				}		
			}
			if( pad.buttons[4].pressed){
				
				if( this.switchWeaponDelay.ready() ){
					if( this.currentTool > 0 ){			
						this.currentTool--;
					}else{		
						this.currentTool = this.inventory.length -1;
					}
					
					if( this.inventory[this.currentTool] != undefined ) this.inventory[ this.currentTool ].startSound.play();
						
				}
			}			
			if ( pad.buttons[7].pressed) { // space /	shoot!			
				if ( currentTool !== undefined) { 
					currentTool.fire(time);
				}
			}

			var angle = getBearing( pad.axes[0], pad.axes[1] );
			var dist = Math.sqrt( pad.axes[0]*pad.axes[0] + pad.axes[1]*pad.axes[1]     );		
			
			var lookAngle = getBearing( pad.axes[2], pad.axes[3] );
			var lookDist = Math.sqrt( pad.axes[2]*pad.axes[2] + pad.axes[3]*pad.axes[3]     );		
			

			
			//deadZones.
			if( dist > 1) dist = 1;
			if( dist >= 0.25) {
				
				// walk direction == angle;
				
				this.move( this.travel * dist, angle);  // move and bearing van be separated.....

				this.bearing["0"] = angle;	
				this.bearing["1"] = lookAngle;
				
				if( lookDist > 1) lookDist = 1;
				if( lookDist >= 0.25) {
					this.bearing["1"] = lookAngle;
				}else{
					this.bearing["1"] = angle; //if no looking, points in movement direction.
				};
				
				if( (this.bearing["1"] +360  - 45 < this.bearing["0"] && this.bearing["1"] +360 + 45 > this.bearing["0"]) ||
					(this.bearing["1"] - 360  - 45 < this.bearing["0"] && this.bearing["1"] - 360 + 45 > this.bearing["0"]) ||
					(this.bearing["1"]  + 45 > this.bearing["0"] && this.bearing["1"]  - 45 < this.bearing["0"])){   //walking forwards
						
						this.state["0"] = "walking";
						this.state["1"] = "walking";
						
				}
				else if( (this.bearing["1"] +360 - 90 - 45 > this.bearing["0"] && this.bearing["1"] + 90 + 45 < this.bearing["0"]) ||
							(this.bearing["1"] - 90 - 45 > this.bearing["0"] && this.bearing["1"] + 90 - 360 + 45 < this.bearing["0"])){ //walking backwards	
						
						this.state["0"] = "walking";
						this.state["1"] = "walking";
					
					this.bearing["0"] -= 180;
				}
				else if(	(this.bearing["1"] + 45 < this.bearing["0"] && this.bearing["1"] + 90+ 45 > this.bearing["0"]) ||
							(this.bearing["1"] -360 + 45 < this.bearing["0"] && this.bearing["1"] -360 + 90 + 45 > this.bearing["0"])	){
						
						this.state["0"] = "walkingSide";
						this.state["1"] = "walkingSide";
						this.bearing["0"] -= 90;
				}
				else{
						
						this.state["0"] = "walkingSide";
						this.state["1"] = "walkingSide";
						this.bearing["0"] += 90;
				};			
			}
			else{
				this.state["0"] = "standing";
				this.state["1"] = "standing";
			};
						
		}
		else{	//no controller;
			this.state["0"] = "standing";
			this.state["1"] = "standing";
		}
		
		/* 
		var moving = 0;
		if (this.controls.left in keysDown ) { // Player holding left
			angle += 270;
			moving++;	
		}
		if (this.controls.down in keysDown ) { // Player holding down
			angle += 180; //pointing down!			
			moving++;
		}
		if (this.controls.right in keysDown ) { // Player holding right
			angle += 90; //pointing down!	
			moving++;
		}
		if (this.controls.up in keysDown ) { // Player holding up
			angle -= 360; //keep pointing up!	
			moving++;
		}	 

		if( this.controls.next in keysDown || pad.buttons[5].pressed){	
			
			if( this.switchWeaponDelay.ready() ){

				if( this.currentTool < this.inventory.length -1 ){	
					this.currentTool++;	
				}else{	
					this.currentTool = 0;
				}
				
				this.inventory[ this.currentTool ].startSound.play();
				
			}		
		}
		if( this.controls.prev in keysDown || pad.buttons[4].pressed){
			
			if( this.switchWeaponDelay.ready() ){
				if( this.currentTool > 0 ){			
					this.currentTool--;
				}else{		
					this.currentTool = this.inventory.length -1;
				}
				
				this.inventory[ this.currentTool ].startSound.play();				
			}
		}
		
		if (this.controls.shoot in keysDown || pad.buttons[7].pressed) { // space /	shoot!			
			if ( currentTool !== undefined) { 
				currentTool.fire(time);
			}
		}		
			
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
			
			this.move( this.travel, angle);
			
			this.bearing["0"] = angle;
			this.bearing["1"] = angle;
			
			this.state["0"] = "walking";
			this.state["1"] = "walking";
			
		}
		else{ //USER IS STANDING....
			
			this.state["0"] = "standing";
			this.state["1"] = "standing";
			
		}	 */
		
		if( currentTool !== undefined ) this.state["1"] = currentTool.animation;
					
		var hitBoxes = this.animations[ this.state[1] ].hitBoxes;
		this.hitboxCords = [ //array of all cords Cord being one square.....
			{
				x:this.x,
				y:this.y,
				xOffset: hitBoxes[0].x * this.scale,
				yOffset: hitBoxes[0].y * this.scale,
				width: hitBoxes[0].width * this.scale,
				height: hitBoxes[0].height * this.scale,  
				bearing: this.bearing["1"],
				
			},{
				x:this.x,
				y:this.y,
				xOffset: hitBoxes[1].x * this.scale,
				yOffset: hitBoxes[1].y * this.scale,
				width: hitBoxes[1].width * this.scale,
				height: hitBoxes[1].height * this.scale, 
				bearing: this.bearing["1"],
				
			},{
				x:this.x,
				y:this.y,
				xOffset: hitBoxes[2].x * this.scale,
				yOffset: hitBoxes[2].y * this.scale,
				width: hitBoxes[2].width * this.scale,
				height: hitBoxes[2].height * this.scale, 
				bearing: this.bearing["1"],
				
			},
		];
		
		this.chooseFrame( time );
	},
	chooseFrame:function(time){
		
		//syncronize two later animations!
		if( this.state[0] == this.state[1]){
			this.layerFrameTime[1] =  this.layerFrameTime[0];
			this.layerCurrentFrame[1] = this.layerCurrentFrame[0];
		}
		
		//var animation = this.animations[state];
		
		time *=1000;
		for (i = 0; i < 2; i++) { 
			
			if( this.layerFrameTime[i] == undefined ) this.layerFrameTime[i]  = 0;
			if( this.layerCurrentFrame[i] == undefined ) this.layerCurrentFrame[i] =0;
			
			var animation = this.animations[ this.state[i] ];
		
			this.layerEachFrameTime[i] = animation["layerTime" + i];
			if (this.layerFrameTime[i] > this.layerEachFrameTime[i] || this.frameChange == true){
				//get next frame
				
				this.layerFrameTime[i] = 0; 
				
				
				if(this.layerCurrentFrame[i] > animation["layer"+i].length -2){
					
					this.layerCurrentFrame[i] = 0;				
					//this.currentFrames["layer" + i].x = animation["layer" + i][ this.layerCurrentFrame[i] ][1]
					//this.currentFrames["layer" + i].y = animation["layer" + i][ this.layerCurrentFrame[i] ][0]

				}
				else{	
				
					this.layerCurrentFrame[i]++;								
					
					
				}
				
				this.currentFrames["layer" + i].x = animation["layer" + i][ this.layerCurrentFrame[i] ][1]
				this.currentFrames["layer" + i].y = animation["layer" + i][ this.layerCurrentFrame[i] ][0]
				
			}
			else{
					this.layerFrameTime[i] += time;				
			}	
		};	
	},
	draw:function(){
		
		if(  this.ready == undefined || this.ready == false ||  this.currentFrames.layer0.y == undefined ) return false;

		this.gotoPlayer();
						
		//save the layer at the player.
		ctx.save();	
		
		//layer 0 //ERROR HERE
		ctx.rotate( this.bearing["0"] * Math.PI/180);
		ctx.drawImage( this.image2,
			this.frameX * (this.currentFrames.layer0.y - 1), //is minus 1
			this.frameY * (this.currentFrames.layer0.x - 1), //is minus 1
			this.frameX, 
			this.frameY, 
			0-this.width/2 * this.scale, 
			0-this.height/2 * this.scale,
			this.width * this.scale, 
			this.height * this.scale
		);

		ctx.restore();
					
		//  LAYER 1
		ctx.rotate( this.bearing["1"] * Math.PI/180);
		ctx.drawImage(this.image, 
			
			this.frameX * (this.currentFrames.layer1.y - 1),  //start cliiping at		
			this.frameY * (this.currentFrames.layer1.x - 1),  //start cliiping at
			this.frameX, //frameSize
			this.frameY,  //frameSize
			0-this.width/2 * this.scale, //x 
			0-this.height/2 * this.scale, //y
			this.width * this.scale,  //output size
			this.height * this.scale //output size
		);
					
		// tool acs as another layer
		if ( this.inventory[ this.currentTool ] !== undefined) { 
			this.inventory[ this.currentTool ].draw();
		}
		
		//back to original canvas layer			
		ctx.restore();		
		
	},
	hasTool:function( tool ){
		
		
		var hasTool = false;
		
		for(  var i = 0; i < this.inventory.length; i++){
			
			if( this.inventory[i] != undefined) {
					
				if( this.inventory[i].name == tool){
					hasTool = true;
				};							
			};
		};
		
		return hasTool;
		
	},
	collide,
	gotoPlayer:function(){
		ctx.save();
		ctx.translate(this.x, this.y);
	},
	drawCords:function(){
		ctx.fillText( "player.x:" + this.x + " player.y:" + this.y,50,50);	
	},
	startRand,
	takeDamage,
	move,
}

var PlayerCollisions = {	
	player:dynamicCollide,
	AiPlayer:dynamicCollide,
	bullet:function(){
		
	},
};

var heroProps = {
	solid:true,
	spriteTorseSrc:"images/bkspr01.png",
	spriteLegsSrc:"images/bkspr02-legs.png",
	frameX:128, //used for sprite clipping
	frameY:128, //used for sprite clipping
	speed:128,
	height:64, //
	width:64,  //
	health:128,
	animations:heroAnimations,
	collisions:PlayerCollisions,
};	