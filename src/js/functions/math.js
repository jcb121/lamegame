function getBearing( changeX, changeY ){
	
	var angle = Math.atan( changeY / changeX) * 180 / Math.PI;
	
	if( changeX > 0 && changeY > 0 ){
			
		angle += 90;
	}
	else if( changeX > 0 && changeY < 0 ){
			
		angle += 90; 
	}
	else if( changeX < 0 && changeY > 0 ){
			
		angle += 270;
			
	}
	else if( changeX < 0 && changeY < 0 ){
		
		angle +=270;
	}

	return angle;
}

function getDistance( x, y, x1, y1 ){
	
	var a = x - x1;
	
	var b = y - y1;
	
	var distance = Math.sqrt( a*a + b*b );
	
	return distance;
}

function calculateEllipse(x, y, a, b, angle, steps) {
	if (steps == null) steps = 36;
	var points = [];

	// Angle is given by Degree Value
	var beta = -angle * (Math.PI / 180); //(Math.PI/180) converts Degree Value into Radians
	var sinbeta = Math.sin(beta);
	var cosbeta = Math.cos(beta);

	for (var i = 0; i < 360; i += 360 / steps){
		var alpha = i * (Math.PI / 180);
		var sinalpha = Math.sin(alpha);
		var cosalpha = Math.cos(alpha);

		var X = x + (a * cosalpha * cosbeta - b * sinalpha * sinbeta);
		var Y = y + (a * cosalpha * sinbeta + b * sinalpha * cosbeta);

		//points.push(	new OpenLayers.Geometry.Point(X, Y)	);
		points.push( {x:X,y:Y} );
	}

	return points;
}

module.exports = {
	getBearing,
	getDistance,
	calculateEllipse
};