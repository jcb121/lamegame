function worldProp( props ){
	
	this.type = "worldProp"; //defaults
	var self = this; //defaults
	this.collectable = false; //defaults
	this.solid = false; //defaults
	
	this.hitboxCords = [];
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	};		
	
	this.startRand(); //defaults
	
	
	if( props.collisions != undefined){	
		this.collisions = {};
		for (var attrname in props.collisions) { 
			this.collisions[attrname] = props.collisions[attrname]; 
		}
		this.collisions.parent = this;		
	}

	
	/* Loaders */
	this.image = new Image();
	this.image.src = props.image;		
	this.image.onload = function(){	
		self.imageReady = true;
	};
	
	this.spawner = [];
	if( typeof props.spawns != "undefined" ){
		
		for( var i = 0; i < props.spawns.length; i++){	
			this.spawner[i] = new tool( props.spawns[i] );	
		};		
	
	};
	
}

worldProp.prototype = {
	update: function(modifier){
		
		if( this.ready ){
			
			if( this.collisions != undefined){
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
			};
		}
		else{	
			this.assetLoader( modifier );  //also updates...
		};		
	},
	draw:function(){
		
		if( this.ready){
			
			ctx.save();
			ctx.translate( this.x, this.y );
			ctx.rotate( this.bearing * (Math.PI/180) );
			
			if( this.height == undefined && this.width == undefined){
				ctx.drawImage(this.image, this.x, this.y);
			}else{
				ctx.drawImage(this.image, 0 -this.width/2, 0 - this.height/2 , this.width, this.height);	
			};
			
			ctx.restore();
			
		}		
	
	},
	assetLoader:function( modifier ){
		
		var count = 0;
		for( var i = 0; i < this.spawner.length; i++){
			
			if( !this.spawner[i].ready ){
				this.spawner[i].update( modifier );
				count++;
			};
		};
		
		if( this.imageReady && count == 0 ){
			this.ready = true;
		};
	},
	giveToPlayer:function( player ){
			
		if( !player.hasTool( this.name ) ){
			
			for( var i = 0; i < this.spawner.length; i++ ){
				
				this.spawner[i].parent = player;				
				this.spawner[i].startSound.play();
				
				player.inventory.push( this.spawner[i] );
				
				this.live = false;
			};
			
		};
		
		
	
		
	},
	collide,
	startRand:startRand,		
};

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




