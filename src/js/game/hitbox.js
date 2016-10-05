class HitBox{
	constructor(hitBoxes){
		this.hitboxes = hitBoxes;
	}

	update(x, y, bearing, scale = 1, state){
		let hitBoxCords = [];

		this.hitboxes[state].forEach(function(hitbox){
			hitBoxCords.push({
				x,
				y,
				bearing,
				"xOffset":hitbox.x * scale,
				"yOffset":hitbox.y * scale,
				"width":hitbox.width * scale,
				"height":hitbox.height * scale,
			})
		});

		return hitBoxCords
	}
}
module.exports = HitBox;