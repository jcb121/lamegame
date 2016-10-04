module.exports = function( rect ){
		
	var points = [];
	
	var xOffset = 0;
	var yOffset = 0;
	//-------------------------------------------------------
	var sin = Math.sin(  ( 90 - rect.bearing) * Math.PI / 180 ); //both pos is ok.
	var cos = Math.cos(  ( 90 - rect.bearing) * Math.PI / 180 ); //both pos is ok
		
	xOffset += sin * rect.xOffset;
	yOffset += cos * rect.xOffset;  	
	
	sin =  	Math.sin( (rect.bearing + 180) * Math.PI / 180 );
	cos = 	Math.cos( (rect.bearing) * Math.PI / 180 );
	
	xOffset += sin * rect.yOffset; //	-7
	yOffset += cos * rect.yOffset; // 	 7
	
	//works....CORRECT
	//console.log( "TOP", xOffset + rect.x , yOffset + rect.y );
		
	points.push({
		x: rect.x + xOffset,
		y: rect.y + yOffset
	});
	
	//000000000000000000000000000000000000000000000000000000000000000000000
	sin = Math.sin( (90 - rect.bearing) * Math.PI / 180 );
	cos =  Math.cos( (90 - rect.bearing) * Math.PI / 180 );
	
	var xNext0 = sin * rect.width;
	var yNext0 =  cos * rect.width;
	
	//works...Correct		
	//console.log( "RIGHT", rect.x + xOffset +  xNext0 , rect.y + yOffset +  yNext0 );
	
	points.push({
		x: rect.x + xOffset + xNext0,
		y: rect.y + yOffset + yNext0,
	});
	
	//000000000000000000000000000000000000000000000000000000000000000000000
	
	sin = 	Math.sin( (   rect.bearing + 180) * Math.PI / 180 );
	cos =  Math.cos( ( rect.bearing) * Math.PI / 180 );
	
	var xNext1 = sin * rect.height; //45
	var yNext1 =  cos * rect.height; //45 
	
	//console.log( "BOTTOM", rect.x + xOffset +  xNext0 + xNext1 , rect.y + yOffset +  yNext0 + yNext1 );
		
	points.push({
		x: rect.x + xOffset+ xNext0 +  xNext1,
		y: rect.y + yOffset + yNext0 + yNext1,
	});
	
	//000000000000000000000000000000000000000000000000000000000000000000000

	
	sin = 	Math.sin( ( 90-  rect.bearing +180) * Math.PI / 180 );
	cos =  Math.cos( (90 - rect.bearing +180 ) * Math.PI / 180 );
	
	var xNext2 = sin *  rect.width;
	var yNext2 = cos * rect.width;
			
	//console.log( "NEXT", rect.x + xOffset +  xNext0 + xNext1 + xNext2 , rect.y + yOffset +  yNext0 + yNext1 + yNext2 );

	points.push({
		x: rect.x + xOffset +  xNext0 + xNext1 + xNext2,
		y: rect.y + yOffset +  yNext0 + yNext1 + yNext2,
	});
	
	return points;
};