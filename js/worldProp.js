function worldProp( props ){
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	}	
	
	this.startRand();
	
	this.image = new Image();
	this.image.src = props.image;		
	this.hitboxCords = [];
	
	 	
	
}

worldProp.prototype = {
	update: function(modifier){
		this.hitboxCords = [ //array of all cords Cord being one square.....
		
			{
				x:this.x - this.width/2,
				y:this.y - this.height/2,
				width: this.width,
				height: this.height,
				bearing: 0,
				
			},
			
		];
	},
	draw:function(){
		ctx.save();
			ctx.translate( this.x, this.y );
			ctx.rotate( this.bearing );
			ctx.drawImage(this.image, 0, 0, this.width, this.height);
		ctx.restore();
	},
	collide:function( obj ){
		if( obj.__proto__.constructor.name == "player" ){ //works
			console.log("contact");
		}
		if( obj.__proto__.constructor.name == "bullet" ){ //works
			
		}
	},
	startRand,
		
}




