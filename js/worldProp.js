function worldProp( props ){
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	}	
	
	this.image = new Image();
	this.image.src = props.image;
		
	this.hitboxCords = [];
	
	this.collide = function( obj ){
		
		if( obj.__proto__.constructor.name == "player" ){ //works
			
		}
		if( obj.__proto__.constructor.name == "bullet" ){ //works
			
		}
		
	};
	
	this.update = function(time){
		
		this.hitboxCords = [ //array of all cords
			//box
			[ 
				{
					x:this.x,
					y:this.y,
				},
				{
					x:this.x,
					y:this.y + this.height,
				},
				{
					x:this.x + this.width,
					y:this.y + this.height,
				},
				{
					x:this.x + this.width,
					y:this.y,
				},
			],
		]; 		
		
	};
	
	this.draw = function(){
		ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
	};

}





//Not works......
function touching(rect1 , rect2){
	
	var rect1zero = false;
	var rect2zero = false;
	
	if(rect1 == false || rect2 == false){		
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
				
	};

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