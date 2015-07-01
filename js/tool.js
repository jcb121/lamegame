function tool(props){
	this.type = "tool";
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	}
	
	this.image = new Image();
	this.image.src = props.gunHeldSrc;
	
	var obj = this;
	this.image.onload = function(){	
		(function(that){	
			that.ready = true;
		})(obj);
	};
	
	
	//this.parent;
	
	this.weaponDelay = new deBounce( 1 / this.useRate );
	this.startSound.play();
}

tool.prototype = {
	update:function(modifier){
		
		if(  this.ready == undefined || this.ready == false ) return false;
		
		this.weaponDelay.update( modifier );
				
		this.x = this.parent.x; 
		this.y = this.parent.y; 
		this.bearing = this.parent.bearing["1"]; //
		
		
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
	
	},
	draw:function(){
		if(  this.ready == undefined || this.ready == false ) return false;
		
		ctx.drawImage(this.image, this.xOffset * this.parent.scale, this.yOffset * this.parent.scale, this.width * this.parent.scale, this.height * this.parent.scale);
		//ctx.drawImage(this.image, this.frameX * (this.currentFrames.layer1.y - 1), this.frameY * (this.currentFrames.layer1.x - 1), this.frameX, this.frameY, -this.width/2, -this.height/2 ,this.width,this.height);
	},
	fire:function( time ){ //fire could be user added.....
		
		if(  this.ready == undefined || this.ready == false ) return false;
		
		if(  this.weaponDelay.ready() ){
			
			this.fireSound.play();
			
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
				
				//hack
				this.parent.parent.addObject(bullet);

			}	
		}
	},
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
		parent:this,
		player: function( player ){
				this.parent.live = false;
				player.takeDamage( 10 );
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
		
		var travel = this.speed * modifier;
				
		this.move( travel, this.bearing );
						
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
	move,
	draw:function(){
		this.drawCircle( this.x, this.y, this.bulletSize, "black");
	},
	collide,
}




