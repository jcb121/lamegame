var Tool = require('./tool');
var collide = require('./functions/collisions').collide;
var startRand = require('./functions/startRand');

function worldProp( props ){
	
	this.type = 'worldProp'; //defaults
	var self = this; //defaults
	this.collectable = false; //defaults
	this.solid = false; //defaults
	
	this.hitboxCords = [];
	
	for (let attrname in props) { 
		this[attrname] = props[attrname]; 
	}
	
	this.startRand(); //defaults
	
	
	if( props.collisions != undefined){	
		this.collisions = {};
		for (let attrname in props.collisions) { 
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
	if( typeof props.spawns !== 'undefined' ){

		props.spawns.forEach(function(spawn, index){
			console.log(spawn);
			this.spawner[index] = new Tool(spawn);
		}.bind(this));
	}
	
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
			}
		}
		else{	
			this.assetLoader( modifier );  //also updates...
		}
	},
	draw:function(canvas){
		if( this.ready){
			
			var ctx = canvas.getContext('2d');
			
			ctx.save();
			ctx.translate( this.x, this.y );
			ctx.rotate( this.bearing * (Math.PI/180) );
			
			if( this.height == undefined && this.width == undefined){
				ctx.drawImage(this.image, this.x, this.y);
			}else{
				ctx.drawImage(this.image, 0 -this.width/2, 0 - this.height/2 , this.width, this.height);	
			}
			
			ctx.restore();
		}
	},
	assetLoader:function( modifier ){
		
		var count = 0;
		for( var i = 0; i < this.spawner.length; i++){
			
			if( !this.spawner[i].ready ){
				this.spawner[i].update( modifier );
				count++;
			}
		}
		
		if( this.imageReady && count == 0 ){
			this.ready = true;
		}
	},
	giveToPlayer:function( player ){
			
		if( !player.hasTool( this.name ) ){
			
			for( var i = 0; i < this.spawner.length; i++ ){
				
				this.spawner[i].parent = player;				
				this.spawner[i].startSound.play();
				
				player.inventory.push( this.spawner[i] );
				
				this.live = false;
			}
			
		}
	},
	collide,
	startRand,
};

module.exports = worldProp;