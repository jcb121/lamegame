var DeBounce = require('./functions/deBounce');
function MouseObject(canvas){
	this.type = 'mouseObject';
	this.ready = true;
	this.clickDelay = new DeBounce( 0.2 );
	
	addEventListener('mousedown', function(e){
		this.down = e;
		if(typeof this.onClick === "function") this.onClick();
	}.bind(this));

	addEventListener('mouseup', function() {
		this.down = false;	
	}.bind(this));
	
	addEventListener('mousemove', function(e) {
		var rect = canvas.getBoundingClientRect();
		this.x =  e.clientX - rect.left;
		this.y = e.clientY - rect.top; 
	}.bind(this)); 
	
}

MouseObject.prototype = {
	click(callback){
		this.onClick = callback;
	},
	update:function(modifier){
		
		this.clickDelay.update( modifier );
				
		this.hitboxCords = [ //array of all cords Cord being one square.....
			{ // x/y needs to be the origin of the object..
				x: this.x + 5,
				y:this.y + 10,
				xOffset: -5,
				yOffset: -10,
				width: 10,
				height: 20,
				bearing: 0,
			}
		];
	},
	draw:function(canvas){
		var ctx = canvas.getContext('2d');
		
		ctx.beginPath();
		ctx.rect(this.x,this.y,10,20);
		ctx.stroke();
		ctx.fill();
	},
};
module.exports = MouseObject;
