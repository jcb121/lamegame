function tool(props){
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	}	
	//console.log(this);

		this.image = new Image();
	this.image.src = props.gunHeldSrc;
	
/* 	this.accuracy = props.accuracy;
	important
	this.xOffset = props.xOffset;
	this.yOffset = props.yOffset;	
	this.frameX = props.frameX;
	this.frameY = props.frameY;
	this.bulletOffsetX = props.bulletOffsetX;
	this.bulletOffsetY = props.bulletOffsetY;
	this.bulletSpeed = props.bulletSpeed;
	this.bulletSpread = props.bulletSpread;
	this.bulletsPerFire = props.bulletsPerFire;
	this.useRate = props.useRate;
	this is the tip of the gun/ bullet origin
	this.name = props.name;
	this.animation = props.animation;
	this.weight = props.weight;
	this.hands = props.hands; */
	
	this.children = [];
	
	this.ammo = 0;
	
	this.x = 0;
	this.y = 0;
	this.direction = 0;
	this.userRateTimer = 0;
	this.toolReady = true;
	
	this.fire = function(time){

		if(this.toolReady == true){
		
		var gap = this.bulletSpread / ( this.bulletsPerFire +1 ); // =1		
		var incriment= 0;	
		var orignalDirection = this.direction;		
			
			//has to loop.
			for (i = 0; i < this.bulletsPerFire ; i++) { 	
				
				
				incriment += gap;
				this.direction += incriment;
				this.direction -= this.bulletSpread;
				this.direction += this.bulletSpread / 2; 
				//above works perf!
				
				var rand = Math.floor((Math.random() * this.accuracy) + 1);				
				this.direction += rand - this.accuracy/2;
				
				//below works perf!
				var Bullet = new bullet(this);	//tool.direction	
				this.direction = orignalDirection;
				Game.addObject(Bullet);
				this.toolReady = false;
				
				//debugger;
			}	
		}
	};
	
	this.update = function(modifier){
		
		if( this.toolReady == false ){
						
			var shotDelay = 1 / this.useRate  ;
			
			if(this.userRateTimer > shotDelay ){	
								
				this.toolReady = true;
				this.userRateTimer = 0;
				
			}else{
				this.toolReady = false;
				this.userRateTimer += modifier;
			}
			
		};
		
		this.x = hero.centerX; //SORT THIS OUT!
		this.y = hero.centerY; //SORT THIS OUT!
		
		this.direction = hero.direction["1"]; //NOT REF TO HERO!
				
		if( this.direction == 0 ){ //up
		
			this.x += this.bulletOffsetX;
			this.y += this.bulletOffsetY;
		
		}
		else if( this.direction == 90 ){ //right
			
			this.x -= this.bulletOffsetY;
			this.y += this.bulletOffsetX;
	
		}
		else if( this.direction == 180 ){ //down
			
			this.x -= this.bulletOffsetX;
			this.y -= this.bulletOffsetY;
			
		}
		else if( this.direction == 270 ){ //left
			
			this.x += this.bulletOffsetY;
			this.y -= this.bulletOffsetX;
		
		}else{
			
			
			var a = this.bulletOffsetX;
			var b = this.bulletOffsetY * -1; //this is negative.
			
			var toolDistance = Math.sqrt(a*a + b*b);
			
			var toolAngle = Math.atan( b / a ) * 180 / Math.PI;
			
			var worldToToolAngle = this.direction + 90 - toolAngle; //fine.
			
			worldToToolAngle -= 90;
			worldToToolAngle *= -1;			
			
			var sin = Math.sin( worldToToolAngle * Math.PI / 180  ); //0.874		
			var cos = Math.cos( worldToToolAngle * Math.PI / 180  ); //0.485
			
			
			//11
			var x = cos * toolDistance;
			var y = sin * toolDistance;
			
			//NE
			if( 0 < this.direction && this.direction < 90){						
				this.x += x;
				this.y -= y; 
			}
			//SE
			if( 90 < this.direction && this.direction < 180){
				this.x += x;
				this.y -= y;	
			}
			//SW
			if( 180 < this.direction && this.direction < 270){
				this.x += x;
				this.y -= y; 		
			}
			//NW
			if( 270 < this.direction && this.direction < 360){
				this.x += x;
				this.y -= y; 
			}	
		};
		
		//update children
		// for (var i = 0; i < this.children.length; i++) {	
			// this.children[i].update();	
		// }
		
	};
	
	this.draw = function(){
		
		ctx.drawImage(this.image, this.xOffset, this.yOffset, this.width, this.height);
		
		//advanced for animations
		//ctx.drawImage(this.image, this.frameX * (this.currentFrames.layer1.y - 1), this.frameY * (this.currentFrames.layer1.x - 1), this.frameX, this.frameY, -this.width/2, -this.height/2 ,this.width,this.height);
					
		
				
		/* //draw children
		for (var i = 0; i < this.children.length; i++) {	
			this.children[i].draw();	
		} */
	};
}

 function bullet(tool){
	
	this.collide = function( obj ){
		
		if( obj.__proto__.constructor.name == "player" ){ //works
			
		}
		if( obj.__proto__.constructor.name == "bullet" ){ //works
			//bullet hit bullet, do nothing
		}
		
	};
	
	this.hitboxCords = [];
	
	this.angle = tool.direction;
	this.speed = tool.bulletSpeed;
	this.bulletSize = tool.bulletSize;
	this.x = tool.x; 
	this.y = tool.y;
	
	if(this.angle < 0){
		this.angle += 360;	
	}
	
	else if( this.angle > 360){
		this.angle -= 360;
	};
	
	
		
	this.update = function(modifier){
		
		//world LIMITS......
		if(this.x > 999 || this.x < -999 || this.y > 999 || this.y < -999 ){
			this.live = false;
			return false;
		}
		
		var travel = this.speed * modifier;
		
		if( this.angle == 0 ){ //up
			this.y -= travel;
		}
		else if( this.angle == 90 ){ //right
			this.x += travel;
		}
		else if( this.angle == 180 ){ //down
			this.y += travel;
		}
		else if( this.angle == 270 ){ //left
			this.x -= travel;
		}else{
			
			var angle = this.angle;
			
			var sin = Math.sin( angle * Math.PI / 180  );
			var cos = Math.cos( angle * Math.PI / 180  );
			
			//
			var x = sin * travel;
			var y = cos * travel;
							
			if( 0 < this.angle && this.angle < 90){
				
				this.x += x;
				this.y -= y;
				
			}
			if( 90 < this.angle && this.angle < 180){
				this.x += x;
				this.y -= y;
			}
			if( 180 < this.angle && this.angle < 270){
				this.x += x;
				this.y -= y;				
			}
			if( 270 < this.angle && this.angle < 360){
				this.x += x;
				this.y -= y;
			}
		};
				
		this.hitboxCords = [ //array of all cords
			//box
			[ 
				{
					x:this.x - this.bulletSize/2,
					y:this.y - this.bulletSize/2,
				},
				{
					x:this.x - this.bulletSize/2,
					y:this.y + this.bulletSize/2,
				},
				{
					x:this.x + this.bulletSize/2,
					y:this.y + this.bulletSize/2,
				},
				{
					x:this.x + this.bulletSize/2,
					y:this.y - this.bulletSize/2,
				},
			],
		]; 	
				
	};
	
	this.draw = function(){
				
		ctx.beginPath();
		ctx.fillStyle = "black";
		ctx.arc(this.x, this.y, this.bulletSize/2 , 0, Math.PI*2, true); 
		ctx.closePath();
		ctx.fill();
																				
	};
	
}