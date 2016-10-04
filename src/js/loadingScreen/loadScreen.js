function LoadScreen(){
	this.x = 1;
	this.y = window.innerHeight/2;
	this.width = window.innerWidth/2;
	this.direction = true;
	
}

LoadScreen.prototype = {
	update:function( modifier ){
		if( this.direction ){
			this.x += 500 * modifier;	
		}else{
			this.x -= 500 * modifier;
		}
		
		
		if( this.x + 50 > this.width ){	
			this.direction = false;
		}
		else if( this.x -50 < 0 ){	
			this.direction = true;	
		}
	},
	draw:function(canvas){
		
		var ctx = canvas.getContext('2d');
		
		ctx.beginPath();
		ctx.arc(this.x, this.y, 50, 0,2*Math.PI);
		ctx.stroke();
		ctx.font = '30px Arial';
		ctx.fillText('Loading', canvas.width /2 -100, canvas.height/2);
	}
};

module.exports = LoadScreen;

var indirectAssets = [
	"images/pistol.png",
	"images/bkspr01.png",
	"images/bkspr02-legs.png",
	"images/zomb.png"
];


