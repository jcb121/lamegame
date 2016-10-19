var DeBounce = require('./functions/deBounce');
var HitBox = require('./game/hitbox');
var collide = require('./functions/collisions').collide;

function MouseObject(canvas){
	this.type = 'mouseObject';
	this.ready = true;
	this.debug  = true;

	this.x = 0-50;
	this.y = 0-50;
	this.height = 20;
	this.width = 10;
	this.scale = 1;
	this.bearing = 0;

	this.travel = 0;

	this.clickDelay = new DeBounce( 0.2 );

	this.state = 'default';
	let hitBox = {
		'default':{
			'hitBoxes':[{
				'x': 0,
				'y': 0,
				'width': this.width,
				'height': this.height,
				'bearing':0
			}]
		}
	};

	this.hitBox = new HitBox(hitBox);
	this.hitBox.parent = this;

	addEventListener('mousedown', function(e){
		this.down = e;
		if(typeof this.onClick === "function") this.onClick();
	}.bind(this));

	addEventListener('mouseup', function() {
		this.down = false;	
	}.bind(this));
	
	addEventListener('mousemove', function(e) {
		var rect = canvas.getBoundingClientRect();
		this.mouseX =  e.clientX - rect.left;
		this.mouseY = e.clientY - rect.top;
	}.bind(this)); 
	
}

MouseObject.prototype = {
	click(callback){
		this.onClick = callback;
	},
	update:function(modifier){

		console.log(this.x);

		this.lastX = this.x;
		this.lastY = this.y;

		this.x = this.mouseX;
		this.y = this.mouseY;

		this.clickDelay.update( modifier );
		this.hitboxCords = this.hitBox.update();

	},
	draw:function(canvas){
		var ctx = canvas.getContext('2d');


		this.hitBox.draw(ctx, 'purple');
		ctx.font = "48px serif";
		ctx.fillText(`${this.x},${this.y}`, 0, 0);

		ctx.translate(this.x, this.y);

		this.hitBox.draw(ctx);
		ctx.font = "48px serif";
		ctx.fillText(`${this.x},${this.y}`, 0, 0);


		ctx.restore();
	},
	collide
};
module.exports = MouseObject;
