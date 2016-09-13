
function LoadScreen( props ){
	this.x = 1;
	this.y = canvas.height/2;
	this.direction = true;
	
};

LoadScreen.prototype = {
	update:function( modifier ){
		if( this.direction ){
			this.x += 500 * modifier;	
		}else{
			this.x -= 500 * modifier;
		};
		
		
		if( this.x + 50 > canvas.width ){	
			this.direction = false;
		}
		else if( this.x -50 < 0 ){	
			this.direction = true;	
		};
	},
	draw:function(){
		
		ctx.beginPath();
		ctx.arc(this.x, canvas.height/2 , 50, 0,2*Math.PI);
		ctx.stroke();
		ctx.font = "30px Arial";
		ctx.fillText("Loading", canvas.width /2 -100, canvas.height/2);
	}
};

var indirectAssets = [
	"images/pistol.png",
	"images/bkspr01.png",
	"images/bkspr02-legs.png",
	"images/zomb.png"
];

function AssetLoader( assets ){
	
	this.loading = [];
	var self = this;
	this.limit = assets.length + 0;
	this.count = 0;
	this.ready = false;
	
	for( var i = 0; i < assets.length; i++ ){
		
		this.loading[i] = new Image();
		this.loading[i].src = assets[i];
		this.loading[i].onload = function(){
			self.count++;
		};
		
	};
	
}

AssetLoader.prototype = {
	update:function( modifier ){
		if( this.ready ){
			
		}
		else{

			if( this.count == this.limit ){
				this.ready = true;
			};
			
		};		
	},
	draw:function(){
		
	},
};
