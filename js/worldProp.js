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
			ctx.drawImage(this.image, 0 -this.width/2, 0 - this.height/2 , this.width, this.height);
		ctx.restore();
	},
	collide:function( obj ){
		if( obj.__proto__.constructor.name == "player" ){ //works
			//console.log("contact");
		}
		if( obj.__proto__.constructor.name == "bullet" ){ //works
			
		}
	},
	startRand,
		
};

function worldArea( props ){
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	}	
	
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
			
			ctx.rect(  -this.width/2,  - this.height/2 , this.width, this.height  );
			ctx.stroke();

		ctx.restore();
	},
	collide:function(){
		
	},
};




