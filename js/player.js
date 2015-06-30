function player(properties){
	
	//Default Values....

		
	for (var attrname in properties) { 
		this[attrname] = properties[attrname]; 
	}	
	
	this.collisions = {};
	for (var attrname in properties.collisions) { 
		this.collisions[attrname] = properties.collisions[attrname]; 
	}
	this.collisions.parent = this;	
	
	this.type = "player";
	this.phaseClass(); //setup the class
	
	this.switchWeaponDelay = new deBounce( 0.2 );
	
	this.startRand(); //start the player
	this.hitboxCords = [];
	
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
			

	var obj = {
		player:this,
	};
	this.image.onload = function(){	
		(function(that){
			
			if( that.player.ready == false){
				that.player.ready = true;
			}else{
				that.player.ready = false;			
			};	
			
		})(obj);
	};
	this.image2.onload = function(){	
		(function(that){
			
			if( that.player.ready == false){
				that.player.ready = true;
			}else{
				that.player.ready = false;			
			};	
			
		})(obj);
	};
	
	//directions of each layer
	this.bearing = {
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
	this.layerFrameTime = {
		"0":0,
		"1":0,
		"2":0,
	};
	//the current frame of animation
	this.layerCurrentFrame = {
		"0":0,
		"1":0,
		"2":0,
	};
	//how long each frame lasts
	this.layerEachFrameTime = {
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
};

player.prototype = {
	update:function(modifier){
		if(  this.ready == undefined || this.ready == false ) return false;
				
		this.switchWeaponDelay.update( modifier );
		
		var time = modifier;
		var currentTool = this.inventory[ this.currentTool ];
		var hands = 0;
		
		this.travel = 0;
		
		if ( currentTool !== undefined) { 			
			currentTool.update(time);
			modifier = modifier / currentTool.weight;
			hands = currentTool.hands;
		}
				
		var moving = 0;
		var angle = 0;			
		
		this.travel = this.speed * modifier;
		
		

		
		this.controllerIndex = 0;
		
		console.log( navigator.getGamepads() );
		var pad = navigator.getGamepads()[ this.controllerIndex ];		
		
		if (this.controls.left in keysDown ||  pad.buttons[14].pressed ) { // Player holding left
			angle += 270;
			moving++;	
		}
		if (this.controls.down in keysDown ||  pad.buttons[13].pressed) { // Player holding down
			angle += 180; //pointing down!			
			moving++;
		}
		if (this.controls.right in keysDown ||  pad.buttons[15].pressed) { // Player holding right
			angle += 90; //pointing down!	
			moving++;
		}
		if (this.controls.up in keysDown ||  pad.buttons[12].pressed) { // Player holding up
			angle -= 360; //keep pointing up!	
			moving++;
		}	

		
		if( this.controls.next in keysDown || pad.buttons[5].pressed){	
			
			if( this.switchWeaponDelay.ready() ){
				console.log( this.inventory, this.currentTool );
				if( this.currentTool < this.inventory.length -1 ){	
					this.currentTool++;	
				}else{	
					this.currentTool = 0;
				}
				
			}		
		}
		if( this.controls.prev in keysDown || pad.buttons[4].pressed){
			
			if( this.switchWeaponDelay.ready() ){
				if( this.currentTool > 0 ){			
					this.currentTool--;
				}else{		
					this.currentTool = this.inventory.length -1;
				}				
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
			
		}else{ //USER IS STANDING....
			
			this.state["0"] = "standing";
			this.state["1"] = "standing";
			
		}	
		
		angle = getBearing( pad.axes[0], pad.axes[1] );
		var dist = Math.sqrt( pad.axes[0]*pad.axes[0] + pad.axes[1]*pad.axes[1]     );		
		
		//deadZones.
		if( dist > 1) dist = 1;
		if( dist >= 0.25) {
			this.bearing["0"] = angle;	
			this.bearing["1"] = angle;
			this.move( this.travel * dist, angle);
			
			this.state["0"] = "walking";
			this.state["1"] = "walking";
		};
		
		
		//weapon always overwrites standing....
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
				
			},
			{
				x:this.x,
				y:this.y,
				xOffset: hitBoxes[1].x * this.scale,
				yOffset: hitBoxes[1].y * this.scale,
				width: hitBoxes[1].width * this.scale,
				height: hitBoxes[1].height * this.scale, 
				bearing: this.bearing["1"],
				
			},
			{
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
			
			
			var animation = this.animations[ this.state[i] ];
		
			this.layerEachFrameTime[i] = animation["layerTime" + i];
			if (this.layerFrameTime[i] > this.layerEachFrameTime[i] || this.frameChange == true){
				//get next frame
				
				this.layerFrameTime[i] = 0; 
				
				
				if(this.layerCurrentFrame[i] > animation["layer"+i].length -2){
					
					this.layerCurrentFrame[i] = 0;				
					this.currentFrames["layer" + i].x = animation["layer" + i][ this.layerCurrentFrame[i] ][1]
					this.currentFrames["layer" + i].y = animation["layer" + i][ this.layerCurrentFrame[i] ][0]
					
				}else{	
				
					this.layerCurrentFrame[i]++;				
					
					this.currentFrames["layer" + i].x = animation["layer" + i][ this.layerCurrentFrame[i] ][1]
					this.currentFrames["layer" + i].y = animation["layer" + i][ this.layerCurrentFrame[i] ][0]
						
				}
			}else{
					this.layerFrameTime[i] += time;
			}
			

		};	
	},
	draw:function(){
		
		if(  this.ready == undefined || this.ready == false ) return false;

		this.gotoPlayer();
						
		//save the layer at the player.
		ctx.save();	
	
		//layer 0
		ctx.rotate( this.bearing["0"] * Math.PI/180);
		ctx.drawImage( this.image2,
			this.frameX * (this.currentFrames.layer0.y - 1),
			this.frameY * (this.currentFrames.layer0.x - 1), 
			this.frameX, 
			this.frameY, 
			-this.width/2 * this.scale, 
			-this.height/2 * this.scale, 
			this.width * this.scale, 
			this.height * this.scale
		);

		ctx.restore();
					
		//  LAYER 1
		ctx.rotate( this.bearing["1"] * Math.PI/180);
		ctx.drawImage(this.image, 
			this.frameX * (this.currentFrames.layer1.y - 1), 
			this.frameY * (this.currentFrames.layer1.x - 1), 
			this.frameX,
			this.frameY, 
			-this.width/2 * this.scale, 
			-this.height/2 * this.scale,
			this.width * this.scale,
			this.height * this.scale
		);
					
		// tool acs as another layer
		if ( this.inventory[ this.currentTool ] !== undefined) { 
			this.inventory[ this.currentTool ].draw();
		}
		
		//back to original canvas layer			
		ctx.restore();		
		
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
	calculateBalance,
	phaseClass,
	damage,
	move,
}