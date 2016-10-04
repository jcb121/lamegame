var collide = require('../functions/collisions').collide;
function MenuItem( props ){
	this.type = 'menuItem';
	this.ready = true; //always ready as no assets
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	}
	
	if( props.collisions != undefined){
		
		this.collisions = {};
		for (let attrname in props.collisions) { 
			this.collisions[attrname] = props.collisions[attrname]; 
		}
		this.collisions.parent = this;		
	}
	
	this.hitboxCords = [];
}

MenuItem.prototype = {
	setMode:function(mode){
		this.parent.setMode(mode);
	},
	update:function(){
		
		this.hitboxCords = [ //array of all cords Cord being one square.....
			{ // x/y needs to be the origin of the object..
				x: this.x + this.width/2,
				y:this.y + this.height/2,
				xOffset: - this.width/2,
				yOffset: - this.height/2,
				width: this.width,
				height: this.height,
				bearing: this.bearing,
			},
		];
		
	},
	draw:function(canvas){
		if( typeof this.x == 'undefined'){
			this.x = canvas.width/2 - this.width/2;
		}
		var ctx = canvas.getContext('2d');
					
		ctx.fillStyle= this.boxColor;
		
		ctx.beginPath;
		ctx.fillRect( this.x, this.y, this.width, this.height);
		ctx.closePath;
		
		ctx.fillStyle= this.textColor;
		
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		
		ctx.font = this.fontSize + 'px  ' + this.font;
		
		ctx.beginPath;
		ctx.fillText(  this.text, this.x +this.width/2, this.y + this.height/2 ); //cool
		ctx.closePath;
	},
	collide,
};

module.exports = MenuItem;