var getPoints = require('../functions/getPoints');
var SAT = require('../../../packages/sat-js/SAT');
module.exports = function(rect1 , rect2){
			
	rect1 = getPoints( rect1 );
	rect2 = getPoints( rect2 );		
	var V = SAT.Vector;
	var P = SAT.Polygon;
	var polygon1 = new P(new V(0,0), [
		new V(rect1[3].x, rect1[3].y),
		new V(rect1[2].x, rect1[2].y),
		new V(rect1[1].x, rect1[1].y),
		new V(rect1[0].x, rect1[0].y),
	]);
	var polygon2 = new P(new V(0,0), [
		new V(rect2[3].x, rect2[3].y),
		new V(rect2[2].x, rect2[2].y),
		new V(rect2[1].x, rect2[1].y),
		new V(rect2[0].x, rect2[0].y),
	]);	
	var response = new SAT.Response();

	var collided = SAT.testPolygonPolygon(polygon1, polygon2, response);
	
	return [ collided, response ];
};