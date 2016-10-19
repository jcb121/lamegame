var collide = function( obj, hitInfo, modifier ){

	if(typeof this.collisions === 'undefined' || typeof this.collisions[obj.type] === 'undefined' || this.collisions[obj.type].length ===0 ) return;

	var {action, value} = this.collisions[obj.type];

	this[action](obj, value);



	/*if(typeof this.collisions[ obj.type ] === 'object'){
		for( var i = 0; i <	this.collisions[ obj.type ].length; i++	){
			this.collisions[ obj.type ][i]( obj , hitInfo, modifier);
		}
	}else{
		this.collisions[ obj.type ]( obj , hitInfo, modifier);
	}*/
};

//types of collisions
var dynamicCollide = function(object , hitInfo){ //Best used for things that can be pushed!
	
	if( this.parent.collisionActive){
		this.parent.collisionActive = false;
	}else{
			
		//console.log( hitInfo ); 
		
		if( hitInfo.flip ){
		
			this.parent.x -= hitInfo.overlapV.x /2;
			this.parent.y -= hitInfo.overlapV.y /2;	
			object.x += hitInfo.overlapV.x /2;
			object.y += hitInfo.overlapV.y /2;
			
		}else{
			
			this.parent.x += hitInfo.overlapV.x /2;
			this.parent.y += hitInfo.overlapV.y /2;	
			object.x -= hitInfo.overlapV.x /2;
			object.y -= hitInfo.overlapV.y /2;
			
		}
		
		this.collisionActive = false;
		object.collisionActive = true;
	}	
};	
var reflectCollide = function(object , hitInfo){ //Best used for things that can be pushed!
					
	object.x += hitInfo.overlapV.x;
	object.y += hitInfo.overlapV.y;
	
	if( object.bearing > 360) object.bearing - 360;
	else if ( object.bearing > 0) object.bearing +360;
	
	//object.bearing = 360 - object.bearing;
	
	if( object.bearing == 0 || object.bearing == 90 || object.bearing == 180 || object.bearing == 270){
		
		object.bearing += 180;
		if( object.bearing > 360) object.bearing -= 360;
		
	}else if( 0 < object.bearing && object.bearing < 90){
		object.bearing = 180 - object.bearing;
	}else if( 90 < object.bearing && object.bearing < 180){
		
		object.bearing = 180 + ( 180 - object.bearing );
	
	}else if( 180 < object.bearing && object.bearing < 270){
		object.bearing = 180 - ( object.bearing -180 );
	}
	else if( 270 < object.bearing && object.bearing < 360){
		object.bearing =  360 - object.bearing  ;
	}	
};	
var staticCollide = function( object , hitInfo ){ //Best used for walls
	object.x += hitInfo.overlapV.x;
	object.y += hitInfo.overlapV.y;
};
var killCollide = function( object ){ //best used for fire walls. Kills the object on touch.
	object.live = false;
};
var suicideCollide = function(){
	this.parent.live = false;
};
var damageCollide = function( object, hitInfo ){
	
	var amount = 10;
	
	object.damage( amount );
	
};

module.exports = {
	collide,
	dynamicCollide,
	reflectCollide,
	staticCollide,
	killCollide,
	suicideCollide,
	damageCollide
};