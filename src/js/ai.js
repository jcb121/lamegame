function ZombieSpawner(){
	this.ready = true;
};

ZombieSpawner.prototype = {
	update:function(modifier){
		
		if( this.zombieDelay == undefined){
			this.incriment = 1;
			this.zombieDelay = new deBounce(10);
		};	
		
		this.zombieDelay.update(modifier);	
		if( this.zombieDelay.ready() ){
			for( var i = 0; i < this.incriment; i++){
				
				if( this.parent.children.length >40){	
					console.log("limit");
					continue;	
				} ;
								
				var zomb = new AiPlayer( zombieProps )
				
				zomb.parent = this.parent;
								
				this.parent.children.push( zomb );
				
			};
			this.incriment++;
		};
		
		
		if( this.weaponSpawnDelay == undefined){
			this.weaponSpawnDelay = new deBounce(50);
		};
		this.weaponSpawnDelay.update(modifier);
		if( this.weaponSpawnDelay.ready() ){
			
			var worldShotgun = new worldProp( shotgunWorldProps );
			var worldPistol = new worldProp( pistolWorldProps );
			var worldMachineGun = new worldProp( machineGunWorldProps );
			
			this.parent.children.push( worldShotgun );
			this.parent.children.push( worldPistol );
			this.parent.children.push( worldMachineGun );
			
		};
	},
	draw:function(){},
	
};

function AiPlayer(props){
	
	this.type  = "AiPlayer";
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	}
		
	if( props.collisions != undefined){	
		this.collisions = {};
		for (var attrname in props.collisions) { 
			this.collisions[attrname] = props.collisions[attrname]; 
		}
		this.collisions.parent = this;		
	}
	
	this.image = new Image();
	this.image.src = props.spriteTorseSrc;
	var imgLoad = function(){
		this.ready = true;
	};
	this.image.onload = imgLoad.bind(this)();
	

	
	this.currentFrames = {};
	
	this.startRand();	//sets X Y Bearing

	this.attackDelay = new deBounce(1);	
	if( this.startSound != undefined) this.startSound.play();
}

AiPlayer.prototype = {
	update:function(modifier){
		
		this.attackDelay.update( modifier );
		this.travel = this.speed * modifier;
		
		this.tracking = this.parent.players;
		if( this.tracking.length == 0){
			
			if( this.turnDelay == undefined) this.turnDelay = new deBounce(1);
			this.turnDelay.update( modifier );
			if( this.turnDelay.ready() ){
				
				this.bearing += Math.floor(Math.random() * 90);
				this.bearing -= 45;
					
			}
			
			
			
		}
		else if( this.tracking.length ==1 ){
		
			var changeX = this.x - this.tracking[0].x;
			var changeY = this.y - this.tracking[0].y;
			
			var bearing = getBearing( changeX, changeY);
			bearing += 180;
			if( bearing >= 360) bearing -= 360;
			
			this.bearing = bearing;

			
			
		}
		else{
			
			// compelling AI - go to the closest player...
			var following = 0;
			var shortest = -1;
						
			for( var i = 0; i < this.tracking.length; i++ ){
				
				var dist = getDistance( this.x, this.y, this.tracking[i].x , this.tracking[i].y );				
				
				if(  shortest == -1 || dist < shortest  ){
					shortest = dist;
					following = i;
				};
			};
			
			
			var changeX = this.x - this.tracking[ following ].x;
			var changeY = this.y - this.tracking[ following ].y;
			
			var bearing = getBearing( changeX, changeY);
			bearing += 180;
			if( bearing >= 360) bearing -= 360;
			
			this.bearing = bearing;
			
			
		}
		
		
		this.move( this.travel, this.bearing );
		
		
		
		
		this.state = "walking";
		
		var hitBoxes = this.animations[ this.state ].hitBoxes;
		
		this.hitboxCords = [ //array of all cords Cord being one square.....
			{
				x:this.x,
				y:this.y,
				xOffset: hitBoxes[0].x,
				yOffset: hitBoxes[0].y,
				width: hitBoxes[0].width,
				height: hitBoxes[0].height,  
				bearing: this.bearing,
				
			},
			{
				x:this.x,
				y:this.y,
				xOffset: hitBoxes[1].x,
				yOffset: hitBoxes[1].y,
				width: hitBoxes[1].width,
				height: hitBoxes[1].height, 
				bearing: this.bearing,
				
			},
			{
				x:this.x,
				y:this.y,
				xOffset: hitBoxes[2].x,
				yOffset: hitBoxes[2].y,
				width: hitBoxes[2].width,
				height: hitBoxes[2].height, 
				bearing: this.bearing,
				
			},
		];
		
		this.chooseFrame( modifier );
	},
	draw:function(){
				
		if(  this.ready == undefined || this.ready == false ||  this.currentFrames.y == undefined ) return false;
				
		this.gotoPlayer();
		ctx.save();	

		ctx.rotate( this.bearing * Math.PI/180);
				
		ctx.drawImage(this.image, 	
			this.frameX * (this.currentFrames.y - 1),  //start cliiping at		
			this.frameY * (this.currentFrames.x - 1),  //start cliiping at
			this.frameX, //frameSize
			this.frameY,  //frameSize
			0 -this.width/2, //x 
			0 -this.height/2, //y
			this.width ,  //output size
			this.height  //output size
		);
			
		ctx.restore();
			ctx.restore();
		
	},
	chooseFrame:function(time){

		time *=1000;
					
		if( this.layerFrameTime == undefined ) this.layerFrameTime  = 0;
		if( this.layerCurrentFrame == undefined ) this.layerCurrentFrame =0;
			
		var animation = this.animations[ this.state ]; //walking normally!
					
			this.layerEachFrameTime = animation["layerTime"];	
			if (this.layerFrameTime > this.layerEachFrameTime ){
				
				this.layerFrameTime = 0; 
				
				if(this.layerCurrentFrame > animation["layer"].length -2){
					
					this.layerCurrentFrame = 0;				
					this.currentFrames.x = animation["layer"][ this.layerCurrentFrame ][1]
					this.currentFrames.y = animation["layer"][ this.layerCurrentFrame ][0]
					
				}
				else{	
				
					this.layerCurrentFrame++;				
										
					this.currentFrames.x = animation["layer"][ this.layerCurrentFrame ][1]
					this.currentFrames.y = animation["layer"][ this.layerCurrentFrame ][0]
				
				}
			}
			else{				
					this.layerFrameTime += time;
			}
	},
	startRand,
	gotoPlayer:function(){
		ctx.save();
		ctx.translate(this.x, this.y);
	},
	collide,
	move,
	takeDamage,
	getDistance,
};



var zombieProps = {
		solid:true,
		spriteTorseSrc:"images/zomb.png",
		frameX:128,
		frameY:128,
		speed:50,
		height:64,
		width:64,
		health:128,
		damage:10,
		startSound:zombieSpawnSound,
		deathSound:zombieDyingSound,
		animations:zombieAnimations,
		collisions:{
			bullet:function(bullet){
				bulletHitBodySound.play();
				bullet.live = false;
				this.parent.takeDamage( 20 );
			},
			player:function( player ){
				if( this.parent.attackDelay.ready() ){
					
					zombieBiteSound.play();
					player.takeDamage( this.parent.damage );
				}
			},
			AiPlayer:dynamicCollide,
		},
	};