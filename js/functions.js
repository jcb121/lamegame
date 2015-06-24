var startRand = function(){	
	if( this.x == undefined){
		this.x = (Math.random() * (canvas.width - this.width/2));
	};
	if( this.y == undefined){
		this.y = (Math.random() * (canvas.height - this.height/2));	
	};
	if( this.bearing == undefined){
		this.bearing = Math.random() * 360;
	};
}; 

var incAccuracy = function( amount ){};
var decAccuracy = function( amount ){};
var heal = function( amount ){};
var damage = function( amount ){};
var inflate = function( amount ){};
var deflate = function( amount ){};
var moveUp = function( distance ){
	this.y -= distance;
};
var moveDown = function( distance ){
	this.y += distance;
};
var moveLeft = function( distance ){
	this.x -= distance;
};
var moveRight = function( distance ){
	this.x += distance;
};
var move = function( distance, angle ){
	
	var sin = Math.sin( angle * Math.PI / 180  );
	var cos = Math.cos( angle * Math.PI / 180  );
	
	var x = sin * distance;
	var y = cos * distance;
	
	this.x += x;
	this.y -= y;	
};
var getBearing = function( changeX, changeY ){
	
};
var getAngle = function(changeX, changeY){};
var getTravel = function(changeX, changeY){};
var drawCircle = function(x, y, size, color){
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc( x, y, size/2 , 0, Math.PI*2, true);
	ctx.fill();	
};
var addToQuadrant = function(x, y, angle){
	
	if( 0 < angle && angle < 90){						
		this.x += x;
		this.y -= y; 
	}
	else if( 90 < angle && angle < 180){
		this.x += x;
		this.y -= y;	
	}
	else if( 180 < angle && angle < 270){
		this.x += x;
		this.y -= y; 		
	}
	else if( 270 < angle && angle < 360){
		this.x += x;
		this.y -= y; 
	}
	
}
/* var updateChildren(){
};
var drawChildren(){
	/* //draw children
	for (var i = 0; i < this.children.length; i++) {	
		this.children[i].draw();	
	} 
}; */


//Not works......
function touching(rect1 , rect2){
	


	
	//var rect1zero = false;
	//var rect2zero = false;
	
	if( rect1.bearing % 90 == 0 && rect2.bearing % 90 == 0 ){		
		
		if (rect1.x < rect2.x + rect2.width &&
		   rect1.x + rect1.width > rect2.x &&
		   rect1.y < rect2.y + rect2.height &&
		   rect1.height + rect1.y > rect2.y) {
			// collision detected!
			console.log( rect1, rect2 );
		}
	
	};
	
	
	
	
	
	
	/* if(rect1 == false || rect2 == false){		
		return false;
	}	
	
	//test if rec1 is square
	if(
		rect1[0].x == rect1[1].x ||
		rect1[0].y == rect1[1].y
	){
		rect1zero = true;
	}
	if(
		rect2[0].x == rect2[1].x ||
		rect2[0].y == rect2[1].y 
	){
		rect2zero = true;
	}
	
	if( rect1zero && rect2zero){
	
		if (   
		//testing outsides
		rect1[1].x < rect2[3].x	&&
		//testing insides
		rect1[3].x > rect2[1].x  && 
	   
	   //==============================
	   
		rect1[3].y < rect2[1].y  &&
	   
		rect1[1].y > rect2[3].y ) {
		
		return true;
		
		}
				
	}else{
				
	}; */

	return false;
}

function rotate(x, y, xm, ym, a) {
   

   var cos = Math.cos,
        sin = Math.sin,

        a = a * Math.PI / 180, // Convert to radians because that is what
                               // JavaScript likes

        // Subtract midpoints, so that midpoint is translated to origin
        // and add it in the end again
        xr = (x - xm) * cos(a) - (y - ym) * sin(a)   +  xm,
        yr = (x - xm) * sin(a) + (y - ym) * cos(a)   +  ym;
		
		//debugger;
		
	return {
		x:xr,
		y:yr,
	};
	
}