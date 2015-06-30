function worldProp( props ){
	
	this.type = "worldProp";
	this.collectable = false;
	this.solid = false;
		
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	}
		
	if( props.collisions != undefined){
		
		this.collisions = {};
		for (var attrname in props.collisions) { 
			this.collisions[attrname] = props.collisions[attrname]; 
		}
		this.collisions.parent = this;		
	}
	
	this.startRand();
		
	this.image = new Image();
	this.image.src = props.image;		
	
	var obj = this;
	this.image.onload = function(){	
		(function(that){	
			that.ready = true;
		})(obj);
	};
	
	this.hitboxCords = [];
	
}

worldProp.prototype = {
	update: function(modifier){
		if(  this.ready == undefined || this.ready == false ) return false;
				
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
	},
	draw:function(){
		if(  this.ready == undefined || this.ready == false ) return false;
		
		ctx.save();
			ctx.translate( this.x, this.y );
			ctx.rotate( this.bearing * (Math.PI/180) );
			
			
			if( this.height == undefined && this.width == undefined){
				ctx.drawImage(this.image, this.x, this.y);
			}else{
				ctx.drawImage(this.image, 0 -this.width/2, 0 - this.height/2 , this.width, this.height);	
			};
			
		ctx.restore();
	},
	collide,
	startRand,
		
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

//-------------------------------------------

function MenuScreen( props ){
	this.type = "menuScreen";
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	}
	
	this.image = new Image();
	this.image.src = props.image;		
	this.children = [];
	this.ready = false;
	
	var obj = this;
	this.image.onload = function(){	
		(function(that){	
			that.ready = true;
		})(obj);
	};
	
	for( var i = 0; i < this.items.length; i++){	
			this.children.push( new MenuItem( this.items[i] ) );
	}
	
	this.children.push( new MouseObject );
	
};

MenuScreen.prototype = {
	
	update:function( modifier ){ 
		
		//updates the children
		for( var i = 0; i < this.children.length; i++){
			
			if( this.children[i].live == false){				
				this.children.splice(i,1);
				continue;
			}; 
			
			this.children[i].update( modifier );
		};
		
		getCollisions( this.children);
		
		
	},
	draw:function(){
		
		if( this.image != undefined){
			ctx.drawImage(this.image,0,0, canvas.width, canvas.height);
		};
		
		for( var i = 0; i < this.children.length; i++){
			this.children[i].draw();
		};
		
	},
};

//-------------------------------------------

function MenuItem( props ){
	this.type = "menuItem";
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	}
	
	if( props.collisions != undefined){
		
		this.collisions = {};
		for (var attrname in props.collisions) { 
			this.collisions[attrname] = props.collisions[attrname]; 
		}
		this.collisions.parent = this;		
	}
	
	this.hitboxCords = [];
}

MenuItem.prototype = {
	update:function( modifier ){
		
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
	draw:function(){
		if( this.x == undefined){
				
				this.x = canvas.width/2 - this.width/2
			}
						
			ctx.fillStyle= this.boxColor;
			
			ctx.beginPath;
			ctx.fillRect( this.x, this.y, this.width, this.height);
			ctx.closePath;
			
			ctx.fillStyle= this.textColor;
			
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			
			ctx.font = this.fontSize + "px  " + this.font;
			
			ctx.beginPath;
			ctx.fillText(  this.text, this.x +this.width/2, this.y + this.height/2 ); //cool
			ctx.closePath;
	},
	collide,
};

//-------------------------------------------

function MouseObject( props ){
	this.type = "mouseObject";
	
	this.clickDelay = new deBounce( 0.2 );
}

MouseObject.prototype = {
	update:function(modifier){
		this.clickDelay.update( modifier );
		
		
		this.x = mouse.x; //gloval vals
		this.y = mouse.y; //gloval vals
		this.down = mouse.down; //gloval vals
		
		this.hitboxCords = [ //array of all cords Cord being one square.....
			{ // x/y needs to be the origin of the object..
				x: this.x + 5,
				y:this.y + 10,
				xOffset: -5,
				yOffset: -10,
				width: 10,
				height: 20,
				bearing: 0,
			},
		];
		
	},
	draw:function(){
		
		ctx.beginPath();
		ctx.rect(this.x,this.y,10,20);
		ctx.stroke();
		ctx.fill();
		
	},
};


