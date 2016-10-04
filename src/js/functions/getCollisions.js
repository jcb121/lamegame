var touching = require('./touching');
module.exports = function( objects, modifier ){
	
	var collisions = [];
	
	//for the amount of objects...
	for( var j = 0; j < objects.length; j++ ){
		//if the object doesn't have a kitbox, skip it.
		if( objects[j].hitboxCords == undefined ) continue;
		//all of the objects hit boxes.
		var objectCords = objects[j].hitboxCords ;
		
		for (var q = 0; q < objects.length; q++) {
			//skip if it's the smae object or undefined.
			if(j >= q || objects[q].hitboxCords == undefined ){continue;}
			
			//all of the targets hitboxes.
			var targetCords = objects[q].hitboxCords;
			
			//how many hitboxes the object has				
			for( var y = 0; y < objectCords.length; y++ ){
				
				//how many hitboxes the target has
				for( var u = 0; u < targetCords.length; u++ ){
					
					var touch = touching( objectCords[y], targetCords[u] );
					
					if( touch[0] )	collisions.push( [ objects[q] , objects[j] , touch[1]  ] );	
					
				}
			}
		}
	}
	
	for (var i = 0; i < collisions.length; i++) {
		
		if( typeof collisions[i][0].collide == 'function'){
			collisions[i][0].collide( collisions[i][1], collisions[i][2], modifier );
			//a ( b )
		}
		
		if( typeof collisions[i][1].collide == 'function'){
			collisions[i][2].flip = true;
			collisions[i][1].collide( collisions[i][0], collisions[i][2], modifier );
			//b ( a )
		}
		
	}
	
	return collisions;
};