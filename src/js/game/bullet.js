var drawCircle = require('../functions/drawing').circle;
var move = require('../functions/movement').move;
var collide = require('../functions/collisions').collide;
function Bullet(tool){
	
	//console.log( tool );
	
	this.type = 'bullet';
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
	}
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


