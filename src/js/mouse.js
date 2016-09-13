function MouseObject( props ){
	this.type = "mouseObject";
	this.ready = true;
	
	this.clickDelay = new deBounce( 0.2 );
};

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
		
		//ctx.beginPath();
		//ctx.rect(this.x,this.y,10,20);
		//ctx.stroke();
		//ctx.fill();
		
	},
};

var mouse = { down:false,}; 

addEventListener("mousedown", function(e) { 	
	mouse.down = e;
}, false); 
addEventListener("mouseup", function(e) { 
	mouse.down = false;	
}, false); 

addEventListener("mousemove", function(e) { 	
	var rect = canvas.getBoundingClientRect();
	mouse.x =  e.clientX - rect.left;
	mouse.y = e.clientY - rect.top; 
}, false); 