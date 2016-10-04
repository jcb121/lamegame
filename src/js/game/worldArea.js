function worldArea( props ){
	
	this.type = "worldArea";
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	}
	
	this.collisions = {};
	for (var attrname in props.collisions) { 
		this.collisions[attrname] = props.collisions[attrname]; 
	}
	this.collisions.parent = this;		
	
	this.ready = true;
	this.hitboxCords = [];
};

worldArea.prototype = {
	update:function(modifier){		
		this.hitboxCords = [ //array of all cords Cord being one square.....
			{ // x/y needs to be the origin of the object..
				x:this.x,
				y:this.y,
				xOffset: - this.width/2,
				yOffset: - this.height/2,
				width: this.width,
				height: this.height,
				bearing: this.bearing,
				
			},
		];
	},
	draw:function(){
		ctx.save();
			ctx.translate( this.x, this.y );
			ctx.rotate( this.bearing * (Math.PI/180) );
			
			ctx.beginPath();
			ctx.rect(  -this.width/2,  - this.height/2 , this.width, this.height  );
			ctx.closePath();
			
			ctx.stroke();

		ctx.restore();
	},
	collide,
};

