function circle(canvas, x, y, size, color, percentage){
	
	var ctx = canvas.getContect();
	
	if( typeof percentage == 'undefined'){
		percentage = 2;
	}
	
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.arc( x, y, size/2 , 0, Math.PI * percentage, true);
	ctx.fill();	
}

module.exports = {
	circle
};