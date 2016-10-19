class HitBox{
	constructor(hitBoxes){
		this.hitBoxes = hitBoxes;
	}

	update(){
		this.hitBoxCords = [];
		this.hitBoxes[this.parent.state].hitBoxes.forEach(function(hitBox){

			this.hitBoxCords.push({
				"x":this.parent.x,
				"y":this.parent.y,
				"bearing":this.parent.bearing,
				"xOffset":hitBox.x * this.parent.scale,
				"yOffset":hitBox.y * this.parent.scale,
				"width":hitBox.width * this.parent.scale,
				"height":hitBox.height * this.parent.scale,
			});
		}.bind(this));

		return this.hitBoxCords
	}

	draw(ctx, colour = 'blue'){
		if(this.parent.debug !== true) return;

		this.hitBoxes[this.parent.state].hitBoxes.forEach(function(box){
			ctx.beginPath();
			ctx.lineWidth='2';
			ctx.strokeStyle=colour;
			ctx.rect(box.x, box.y, box.width, box.height);
			ctx.stroke();
		}.bind(this));
	}
}
module.exports = HitBox;