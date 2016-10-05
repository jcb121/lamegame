var touching = require('./touching');
module.exports = function( objects, modifier ){
	var collisions = [];
	var combinations = [];

	objects.forEach(function(objectA, indexA){
		//if the object doesn't have a kitbox, skip it.
		if(typeof objectA.hitboxCords === 'undefined' || objectA.hitboxCords.length === 0) return;

		objects.forEach(function(objectB, indexB){
			if(typeof objectB.hitboxCords === 'undefined' || objectB.hitboxCords.length === 0) return;
			if(indexA >= indexB) return;
			if(objectA.static && objectB.static) return;

			combinations.push([objectA, objectB]);
		});
	});

	combinations.forEach(function(objects){
		objects[0].hitboxCords.forEach(function(hitBoxA){
			objects[1].hitboxCords.forEach(function(hitBoxB){
				let touch = touching( hitBoxA, hitBoxB );
				if( touch[0] )	collisions.push( [ objects[0] , objects[1] , touch[1]  ] );
			});
		});
	});

	collisions.forEach(function(collision){
		if( typeof collision[0].collide === 'function'){
			collision[0].collide( collision[1], collision[2], modifier );
			//a ( b )
		}

		if( typeof collision[1].collide === 'function'){
			collision[2].flip = true;
			collision[1].collide( collision[0], collision[2], modifier );
			//b ( a )
		}
	});

	return collisions;
};