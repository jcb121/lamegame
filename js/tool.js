function tool(props){
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	}	
		
	this.image = new Image();
	this.image.src = props.gunHeldSrc;
	
	this.parent;
	this.children = [];
	
	this.ammo = 0;
	this.x = 0;
	this.y = 0; 
	//this.bearing = 0;
	this.userRateTimer = 0;
	this.toolReady = true;
	
}

tool.prototype = {
	update:function(modifier){
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
		
		this.x = this.parent.x;
		this.y = this.parent.y; 
		this.bearing = this.parent.bearing["1"]; //
		
		if( this.bearing == 0 ){ //up
		
			this.moveDown( this.bulletOffsetY * this.parent.scale );
			this.moveRight( this.bulletOffsetX * this.parent.scale );
			
		}
		else if( this.bearing == 90 ){ //right		
		
			this.moveLeft( this.bulletOffsetY * this.parent.scale );
			this.moveDown( this.bulletOffsetX * this.parent.scale );
			
		}
		else if( this.bearing == 180 ){ //down		
		
			this.moveUp( this.bulletOffsetY * this.parent.scale );
			this.moveLeft( this.bulletOffsetX * this.parent.scale );
			
		}
		else if( this.bearing == 270 ){ //left	
		
			this.moveRight( this.bulletOffsetY * this.parent.scale );
			this.moveUp( this.bulletOffsetX * this.parent.scale );
			
		}else{
			
			var a = this.bulletOffsetX * this.parent.scale;
			var b = this.bulletOffsetY * this.parent.scale * -1; //this is negative.
			
			var toolDistance = Math.sqrt(a*a + b*b);
			
			var toolAngle = Math.atan( b / a ) * 180 / Math.PI;
			
			var worldToToolAngle = this.bearing + 90 - toolAngle; //fine.
			
			worldToToolAngle -= 90;
			worldToToolAngle *= -1;			
			
			var sin = Math.sin( worldToToolAngle * Math.PI / 180  ); //0.874		
			var cos = Math.cos( worldToToolAngle * Math.PI / 180  ); //0.485

			var x = cos * toolDistance;
			var y = sin * toolDistance;
			
			this.x += x;
			this.y -= y; 
		};
	},
	draw:function(){
		ctx.drawImage(this.image, this.xOffset * this.parent.scale, this.yOffset * this.parent.scale, this.width * this.parent.scale, this.height * this.parent.scale);
		//ctx.drawImage(this.image, this.frameX * (this.currentFrames.layer1.y - 1), this.frameY * (this.currentFrames.layer1.x - 1), this.frameX, this.frameY, -this.width/2, -this.height/2 ,this.width,this.height);
	},
	fire:function( time ){
		if(this.toolReady == true){
		
			var gap = this.bulletSpread / ( this.bulletsPerFire +1 ); // =1		
			var incriment= 0;	
			var orignalDirection = this.bearing;		
			
			//has to loop.
			for (i = 0; i < this.bulletsPerFire ; i++) { 	
				
				incriment += gap;
				this.bearing += incriment;
				this.bearing -= this.bulletSpread;
				this.bearing += this.bulletSpread / 2; 
			
				var rand = Math.floor((Math.random() * this.accuracy) + 1);				
				this.bearing += rand - this.accuracy/2;
				
				var bullet = new Bullet(this);	
				this.bearing = orignalDirection;
				Game.addObject(bullet);
				this.toolReady = false;
			}	
		}
	},
	moveUp,
	moveDown,
	moveRight,
	moveLeft,
	move,
};

function Bullet(tool){
		
	this.hitboxCords = [];
	this.bearing = tool.bearing;
	this.speed = tool.bulletSpeed;
	this.bulletSize = tool.bulletSize;
	this.x = tool.x;
	this.y = tool.y;
	this.type = "bullet";
		
	this.collisions = {
		player: function( player ){
			player.damage();
		},
		worldProp:function( prop ){
			
		},
	};
	
	if(this.bearing < 0){
		this.bearing += 360;	
	}
	else if( this.bearing >= 360){
		this.bearing -= 360;
	};
}

Bullet.prototype = {
	update:function(modifier){	
		//hit box of map.
		if(this.x > 999 || this.x < -999  || this.y > 999 || this.y < -999 ){
			this.live = false;
			return false;
		}	
		var travel = this.speed * modifier;
		
		if( this.bearing == 0 ) this.moveUp( travel );
		else if( this.bearing == 90 ) this.moveRight(travel);
		else if( this.bearing == 180 ) this.moveDown(travel);
		else if( this.bearing == 270 ) this.moveLeft(travel);
		else this.move( travel, this.bearing );
						
		this.hitboxCords = [  
			{
				x:this.x ,
				y:this.y,
				width: this.bulletSize,
				height: this.bulletSize,
				bearing: 0,
				xOffset: - this.bulletSize/2,
				yOffset: - this.bulletSize/2,
			},
		]; 	
		
	},
	drawCircle,
	moveUp,
	moveDown,
	moveLeft,
	moveRight,
	move,
	draw:function(){
		this.drawCircle( this.x, this.y, this.bulletSize, "black");
	},
	collide,
}