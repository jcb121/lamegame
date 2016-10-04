function up( distance ){	this.y -= distance;	}
function down( distance ){	this.y += distance;}
function left( distance ){	this.x -= distance;}
function right( distance ){	this.x += distance;}
function move( distance, angle ){
	
	var sin = Math.sin( angle * Math.PI / 180  );
	var cos = Math.cos( angle * Math.PI / 180  );
	
	var x = sin * distance;
	var y = cos * distance;
	
	this.x += x;
	this.y -= y;	
}

module.exports = {
	move,
	up,
	right,
	left,
	down
};