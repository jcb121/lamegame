function MenuScreen( props ){
	this.type = "menuScreen";
	var self = this;
	
	
	this.children = [];
		
	var menuBg = {
		image:props.image,
		x:0,
		y:0,
		bearing:0,
	};
	
	this.children.push( new worldProp( menuBg ) ); //background
	
	for( var i = 0; i < props.items.length; i++){	
		this.children.push( new MenuItem( props.items[i] ) );
	}	
	this.children.push( new MouseObject );
	
};

MenuScreen.prototype = {
	update:function( modifier ){ 
		
		if( this.ready ){
			
			for( var i = 0; i < this.children.length; i++){
			
				if( this.children[i].live == false){				
					this.children.splice(i,1);
					continue;
				}; 
				this.children[i].update( modifier );
			};
			
			getCollisions( this.children);
		}
		else{
			this.checkReady( modifier ); //updates also
		};	
	},
	draw:function(){
		
		if( this.ready ){			
			for( var i = 0; i < this.children.length; i++){
				this.children[i].draw();
			};
		}
	},
	checkReady,
};

//-------------------------------------------

function MenuItem( props ){
	this.type = "menuItem";
	this.ready = true; //always ready as no assets
	
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

var mainMenuProps = {
		image:"images/menuBack.jpg",
		music:"",
		items:[
			{	
				text:"START",
				textColor:"white",
				boxColor:"black",
				fontSize:20,
				font: "Arial",
				y:200,
				height:50,
				width:150,
				bearing:0,
				collisions:{
					mouseObject:function( mouse ){	
						if( mouse.down ){	
							if( mouse.clickDelay.ready() ){ //error here						
								startGame();
							};
						};
					},
				}
			},
			{
				text:"Sound",
				textColor:"white",
				boxColor:"black",
				fontSize:20,
				font: "Arial",
				x:200,
				y:0,
				height:50,
				width:150,
				bearing:0,
			},
			{
				text:"Credits",
				textColor:"white",
				boxColor:"black",
				fontSize:20,
				font: "Arial",
				x:0,
				y:0,
				height:50,
				width:150,
				bearing:0,
			},
			{
				text:this.playerCount,
				textColor:"white",
				boxColor:"black",
				fontSize:20,
				font: "Arial",
				x:250,
				y:250,
				height:50,
				width:150,
				bearing:0,
				update:function(){
					var allPads = navigator.getGamepads();
					var pads = [];
					for( var i = 0; i< allPads.length; i++){
						if(allPads[i] != undefined) pads.push( allPads[i] ); 
						
					}
					this.playerCount = pads.length; 
					this.text = this.playerCount;
					//console.log(this);
					return pads.length;
				},
			},
		],
		
	};