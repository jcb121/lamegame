
	function startGame( props ){
		
		var bgImage = new worldProp( bgProps );							
		var worldShotgun = new worldProp( shotgunWorldProps );
		
		//models
		var worldShotgun = new worldProp( shotgunWorldProps );
		var worldShotgun2 = new worldProp( shotgunWorldProps );
		var worldPistol = new worldProp( pistolWorldProps );
		
		var tankArea = new worldArea( tankAreaProps );
		var rocketArea = new worldArea( rocketAreaProps );
		var scoutArea = new worldArea( scoutAreaProps );
		
		//walls
		var topWall = new worldArea( topWallProps );
		var bottomWall = new worldArea( bottomWallProps );
		var leftWall = new worldArea( leftWallProps );
		var rightWall = new worldArea( rightWallProps );
		
		//players
		//var hero = new player( heroProps ); //ditch!
		//var hero2 = new player( hero2Props );
		
		//zombieProps.tracking = [ hero ];
		
		//spawns Zombies! 
		var zombieSpawner = new ZombieSpawner();
		
		//camera
		var camera = new Camera();
		
		var gameMasterProps = {
			camera:camera,
			children:[ bgImage, worldShotgun, worldShotgun2, worldPistol, tankArea,rocketArea, scoutArea, topWall, bottomWall,leftWall, rightWall, zombieSpawner   ], //hero2   
		};
		
		var Game = new gameMaster( gameMasterProps ); //level Not the World!! 
		
		world.children.push( Game );
		world.mode = world.children.indexOf( Game );
		
	}	
	
	
	

var startRand = function(){	
	
	if( this.x == undefined){
		this.x = (Math.random() * (	2000 - this.width/2));
	};
	if( this.y == undefined){
		this.y = (Math.random() * (	1000 - this.height/2));	
	};
	
	if( this.bearing == undefined){
		this.bearing = Math.random() * 360;
	}else if( typeof this.bearing == "object"){
		
		if( this.bearing[0] == undefined ){
			
			this.bearing[0] = Math.random() * 360;
			this.bearing[1] = this.bearing[0];
		}	
	};
}; 

var incAccuracy = function( amount ){};
var decAccuracy = function( amount ){};

//Game hinges

//---------------------------------------------------------
var heal = function( amount, toughness ){};

var takeDamage = function( amount, toughness ){	
	if( toughness != undefined ){	
		this.health -= amount * toughness;		
	}else{
		if( this.toughness != undefined ){		
			this.health -= amount * this.toughness;
		}else{			
			this.health -= amount;	
		}
		
	}
	
	if( this.health < 0){
		
		this.live = false;
		
		if( this.deathSound != undefined) this.deathSound.play() ;
		
	};
	
};

var calculateBalance = function( key, mod){
	
	if( mod == undefined){
			mod = 1;
		};
		
		return (Math.sin( key * Math.PI / 180 ) + 1) * mod;   
	
}

var phaseClass = function(){
	
	if( this.key == undefined) this.key = 0;			

	var a = this.calculateBalance( this.key);
	var b = this.calculateBalance( this.key + 180);
		
	this.scale = a ;
	this.calcSpeed = b * this.speed;	//should be speed really!!! 

	this.toughness = b;
	
	if( this.calcSpeed < 50) this.calcSpeed = 50;
	if( this.scale < 0.5) this.scale = 0.5;
	if( this.toughness < 0.25) this.toughness = 0.25;
		
}


	//works nice!  //initial delay is an issue.....
	var deBounce = function( time, initialDelay ){
		
		this.state = initialDelay;
		if( initialDelay == undefined) state = false;
		
		this.delay = time;
		this.currentTime = 0;
		
		
		this.update = function( time ){
			
			this.currentTime += time;
			
			if( this.currentTime > this.delay || this.state == true ){	
				this.state = true;
			}else{	
				this.state = false;
			}
			
		};
		
		this.ready = function(){
			
			if( this.state ){   //
				
				this.state = false;
				this.currentTime = 0;
				return true;
				
			}else{
					return this.state; //it return false.
			}
		};
		
		
	}
	
	//collide function
	var collide = function( obj, hitInfo, modifier ){	
		if( this.collisions != undefined){
			if( this.collisions[ obj.type ] != undefined) {				
				if(typeof this.collisions[ obj.type ] == "object"){			
					for( var i = 0; i <	this.collisions[ obj.type ].length; i++	){				
						this.collisions[ obj.type ][i]( obj , hitInfo, modifier);
					}
				}else{
					this.collisions[ obj.type ]( obj , hitInfo, modifier);
				}
			} 
		};
	};
	
	//types of collisions
	var dynamicCollide = function(object , hitInfo){ //Best used for things that can be pushed!
		
		if( this.parent.collisionActive){
			this.parent.collisionActive = false;
		}else{
				
				//console.log( hitInfo ); 
				
				if( hitInfo.flip){
				
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
	var staticCollide = function( object , hitInfo ){ //Best used for walls
		object.x += hitInfo.overlapV.x;
		object.y += hitInfo.overlapV.y;
	};
	var killCollide = function( object ){ //best used for fire walls. Kills the object on touch.
		object.live = false;
	};
	var suicideCollide = function(){
		this.parent.live = false;
	}
	var lacksTool = function( newplayer, tool){	

		var lacksTool = true;
		for(  var i = 0; i < newplayer.inventory.length; i++){
			
			if( newplayer.inventory[i] != undefined) {
					
				if( newplayer.inventory[i].name == tool){
					lacksTool = false;
				};							
			};
		};
		return lacksTool;
	}
	var damageCollide = function( object, hitInfo ){
		
		var amount = 10;
		
		object.damage( amount );
		
	};


	var getCollisions = function( objects, modifier ){
		
		var collisions = [];
		
		//for the amount of objects...
		for( var j = 0; j < objects.length; j++ ){
			//if the object doesn't have a kitbox, skip it.
			if( objects[j].hitboxCords == undefined ){ continue;};	
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
			
			if( typeof collisions[i][0].collide == "function"){
				collisions[i][0].collide( collisions[i][1], collisions[i][2], modifier );
				//a ( b )
			}
			
			if( typeof collisions[i][1].collide == "function"){
				collisions[i][2].flip = true;
				collisions[i][1].collide( collisions[i][0], collisions[i][2], modifier );
				//b ( a )
			}
			
		};
		
		return collisions;
	};


	//----------------------------------------------------------

	var moveUp = function( distance ){	this.y -= distance; 	};
	var moveDown = function( distance ){	this.y += distance;};
	var moveLeft = function( distance ){	this.x -= distance;};
	var moveRight = function( distance ){	this.x += distance;};
	var move = function( distance, angle ){
		
		var sin = Math.sin( angle * Math.PI / 180  );
		var cos = Math.cos( angle * Math.PI / 180  );
		
		var x = sin * distance;
		var y = cos * distance;
		
		this.x += x;
		this.y -= y;	
	};

	var getBearing = function( changeX, changeY ){
		
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
	};
	
	
	
	function playSound(buffer) {

		var source = context.createBufferSource();
		source.buffer = buffer;
		source.connect(	context.destination	);
		source.start(0);
				
	}
	
	var getTravel = function(changeX, changeY){};
	var drawCircle = function(x, y, size, color){
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc( x, y, size/2 , 0, Math.PI*2, true);
		ctx.fill();	
	};

	/* var addToQuadrant = function(x, y, angle){
		
		if( 0 < angle && angle < 90){						
			this.x += x;
			this.y -= y; 
		}
		else if( 90 < angle && angle < 180){
			this.x += x;
			this.y -= y;	
		}
		else if( 180 < angle && angle < 270){
			this.x += x;
			this.y -= y; 		
		}
		else if( 270 < angle && angle < 360){
			this.x += x;
			this.y -= y; 
		}
		
	} */
	/* var updateChildren(){
	};
	var drawChildren(){
		/* //draw children
		for (var i = 0; i < this.children.length; i++) {	
			this.children[i].draw();	
		} 
	}; */
	/* function rotate(x, y, xm, ym, a) {
	   

	   var cos = Math.cos,
			sin = Math.sin,

			a = a * Math.PI / 180, // Convert to radians because that is what
								   // JavaScript likes

			// Subtract midpoints, so that midpoint is translated to origin
			// and add it in the end again
			xr = (x - xm) * cos(a) - (y - ym) * sin(a)   +  xm,
			yr = (x - xm) * sin(a) + (y - ym) * cos(a)   +  ym;
			
			//debugger;
			
		return {
			x:xr,
			y:yr,
		};
		
	} */

	function calculateEllipse(x, y, a, b, angle, steps) {
	  if (steps == null)
		steps = 36;
	  var points = [];
	 
	  // Angle is given by Degree Value
	  var beta = -angle * (Math.PI / 180); //(Math.PI/180) converts Degree Value into Radians
	  var sinbeta = Math.sin(beta);
	  var cosbeta = Math.cos(beta);
	 
	  for (var i = 0; i < 360; i += 360 / steps) 
	  {
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

	function touching(rect1 , rect2){
				
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
	}

	function getPoints( rect ){
			
		var points = []
		
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
		
		return points
	};