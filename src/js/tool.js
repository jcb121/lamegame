function tool(props){
	this.type = "tool";
	
	this.bulletSize = 3; //Defaults
	this.bulletsPerFire = 1; //Defaults
	this.bulletSpread = 0; //Defaults
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	}
	
	var self = this;
	this.image = new Image();
	this.image.src = props.gunHeldSrc;	
	this.image.onload = function(){
		
		self.imageReady = true;
	
	};
	
	this.startSound = new SoundClip( this.startSound );
	this.fireSound = new SoundClip( this.fireSound );
	
	this.weaponDelay = new deBounce( 1 / this.useRate );
	this.reloadDelay = new deBounce( this.reloadTime );
	
	
	this.clipAmmo = this.clip;
	//this.ammo -= this.clip; // be nice

}

tool.prototype = {
	update:function(modifier){
		
		if( this.ready ){
			this.weaponDelay.update( modifier );
			
			if( this.reloadDelay.state == false){
				this.reloadDelay.update( modifier );
			};
		}
		else{
			this.checkAssetsLoaded();
		}		
	},
	draw:function(){
		
		if( this.ready ){
			ctx.drawImage(this.image, this.xOffset, this.yOffset, this.width, this.height );
		
			var percentageAmmo;
			
			if( this.ammo > 100){
				percentageAmmo = 2;
			}
			else if( this.ammo <= 0){
				percentageAmmo = 0;
			}
			else{
				percentageAmmo = (this.ammo / 100) *2;
			}
			
			ctx.rotate( -90*Math.PI/180);
			
			ctx.strokeStyle = '#DF0101'; //red
			ctx.lineWidth = 2;
			
			ctx.beginPath();
			ctx.arc(0,0,52,0, percentageAmmo * Math.PI);
			ctx.stroke();
			
			var percentageClip = (this.clipAmmo / this.clip) *2;
			
			
			//Something wrong with clipAmmo and Ammo management.
			//console.log( this.clipAmmo /*  99 */, this.clip /* 100 */, this.ammo /* 0 */, percentageClip /* 1.98 */ );
			
			ctx.strokeStyle = '#0101DF'; //Blue
			ctx.lineWidth = 2;
			
			ctx.beginPath();
			ctx.arc(0,0,50,0, percentageClip * Math.PI);
			ctx.stroke();
			
			
			if( this.reloadDelay.state == false){
					
				var percentage = ( this.reloadDelay.currentTime /  this.reloadDelay.delay) * 2;
				
				ctx.strokeStyle = '#0101DF'; //yellow
				ctx.lineWidth = 2;
				
				ctx.beginPath();
				ctx.arc(0,0,50,0, percentage * Math.PI);
				ctx.stroke();
							
			};
			
			ctx.rotate( 90*Math.PI/180);
		}
		else{
			
		}		
		
	},
	fire:function( time ){ //fire could be user added.....
		
		if( this.ready ){
			
			if(  this.weaponDelay.ready() ){ //ready to shoot
				
				if( this.clipAmmo <= 0 ){ //needs a reload!
					
					
					if( this.reloadDelay.state == undefined){
						//play reload
						this.reloadDelay.state = false;
					};
						
				
					if( this.reloadDelay.ready() ){
						
						this.clipAmmo = this.clip;
						this.ammo -= this.clip;
						
						this.shoot();
						this.fireSound.play();
						
					};		
				}
				else if( this.ammo <= 0){ //needs ammo!
					//play click?	
				}
				else{
					this.shoot();
					this.fireSound.play();
				};
			};
		};		
	},
	shoot,
	checkAssetsLoaded:function(){		
		if( this.startSound.ready && this.fireSound.ready && this.imageReady ){
			this.ready = true;
		};
	},
};


function Bullet(tool){
	
	//console.log( tool );
	
	this.type = "bullet";
	this.parent = tool;
	this.x = tool.x;
	this.y = tool.y;
	this.bearing = tool.bearing;
	
	this.speed = tool.bulletSpeed;
	
	this.bulletSize = tool.bulletSize;
	
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




