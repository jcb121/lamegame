// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

function gameMaster( props ){
	
	this.children = [];
	
	for (var attrname in props) { 
		this[attrname] = props[attrname]; 
	}
		
	this.addObject = function(object){		
		this.children.push(object);
	};	
	
	this.update = function(modifier){		
		
		var collisions = [];
		
		this.camera.update();
		
		for(var i = 0; i < this.children.length; i++) {	
			
			if( this.children[i].live == false){
				this.children.splice(i,1);
				continue;
			}; 
	
			this.children[i].update(modifier);	
		};
		
	
		
		//Works out collisions to some extent......
		for (var j = 0; j < this.children.length; j++) {		

			if( this.children[j].hitboxCords == undefined ){ continue;};	
			var objectCords = this.children[j].hitboxCords ;
			
			
			//how many children in game master.....
			for (var q = 0; q < this.children.length; q++) {		
				if(j >= q || this.children[q].hitboxCords == undefined ){continue;}						
				
				var targetCords = this.children[q].hitboxCords;
				
				//how many hitboxes the object has				
				for( var y = 0; y < objectCords.length; y++ ){
					
					//how many hitboxes the target has
					for( var u = 0; u < targetCords.length; u++ ){
												
						if( touching( objectCords[y], targetCords[u] ) ){
							
							console.log("touching");
							collisions.push( [ this.children[q] , this.children[j] ] );	
						}
					}
				}
			};	
		};
		
		
		for (var i = 0; i < collisions.length; i++) {		
			collisions[i][0].collide( collisions[i][1] );
			collisions[i][1].collide( collisions[i][0] );
		};
		
	};
	
	this.draw = function(){		
				
		for(var i = 0; i < this.camera.following.length; i++){
			
			this.camera.draw( i ); //gives the camera who to draw for... MAY NOT BE NEEDED?
			
			//draws
			for (var i = 0; i < this.children.length; i++) {	
				this.children[i].draw();	
			}; 
			
			
			
		}
		
		//ignore for now...
		if( this.debugging ){			
			//loop through items....
			
			for (var i = 0; i < this.children.length; i++) {	
				
				if( this.children[i].hitboxCords == undefined ){ continue;};	
								
				var boxes = this.children[i].hitboxCords;
	
				for( var k = 0; k < boxes.length; k++){
					
					var box = boxes[k];
					
					ctx.beginPath();
					ctx.lineWidth="1";
					ctx.strokeStyle="blue"; // blue path	
															
					for( var h = 0; h < box.length; h++){
												
						if( h == 0){
						
							ctx.moveTo( box[h].x, box[h].y );
						
						}else if( h == box.length -1){
							ctx.lineTo( box[h].x, box[h].y);
						
						}else{
							ctx.lineTo( box[h].x, box[h].y);
					
						}		
					}
					
					ctx.closePath();
					ctx.stroke(); // Draw it						
				}
			}	
		}	
	};
	
	//console.log(this);
};


function camera(following){
	
	this.following = following;
	
	this.x = []; //this is normall the players XY...
	this.y = []; //array for each player....
			
	
	this.draw = function(){
					
		var x = canvas.width/2;
		var y = canvas.height/2;
		
		x -= this.x;
		y -= this.y;

		ctx.translate( x, y);	
	}
		
	this.update = function(){
		
		for(var i = 0; i < this.following.length; i++){
			
			var x = 0;
			var y = 0;
			
			this.x[i] = this.following[i].x;
			this.y[i] = this.following[i].y;
									
		};
		
		//XY now has the points of both players
		//WORK OUT WHERE THE CAMERA WILL BE OR SPLIT THE SCREEN!
		
		//get distance between players.
		if( this.following.length == 2){
			
			var xDistance = this.following[0].x - this.following[1].x;
			var yDistance = this.following[0].y -this.following[1].y;
			
			//get angle of one player to the next:
			var playerAngle = Math.atan( yDistance / xDistance ) * 180 / Math.PI;
			var playerDistance = Math.sqrt( xDistance * xDistance + yDistance * yDistance );
			
			
			var a = canvas.height/4;
			var b = canvas.height/4;
	
			
			var beta = 0; //(Math.PI/180) converts Degree Value into Radians
			var sinbeta = Math.sin(beta); //equals 0! //save overhead! 
			var cosbeta = Math.cos(beta); //equals 1!
			
			//only want to check player angle and player angle + 180!
				
			var alpha = playerAngle * (Math.PI / 180);
			var sinalpha = Math.sin(alpha);
			var cosalpha = Math.cos(alpha);
			
			var boundryX = 0 + (a * cosalpha * cosbeta - b * sinalpha * sinbeta);
			var boundryY = 0 + (a * cosalpha * sinbeta + b * sinalpha * cosbeta);
			 
			var boundryDistance = Math.sqrt( boundryX * boundryX + boundryY * boundryY ) * 2;
			
			if( playerDistance > boundryDistance){
				
				console.log("split screen!");
			}else{
				
				for (var i = 0; i < this.following.length; i++) {
					
					x += this.following[i].centerX;
					y += this.following[i].centerY; 
				}
			
				this.x = x / this.following.length;
				this.y = y / this.following.length; 
				
			};
			
				
			
			
		
				
		
		};
		
		
		
		
		
		
		
		
		
		
	};
	
	//for debugging, ignore....
	this.drawTarget = function(){
		
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5 , 0, 2 * Math.PI, false);
		ctx.fillStyle = 'black';
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = '#003300';
		ctx.stroke();
		
		 var arrayLength = this.following.length;
		for (var i = 0; i < arrayLength; i++) {
			
			var x = this.following[i].x + this.following[i].width/2;
			var y = this.following[i].y + this.following[i].height/2; 
			
			
			ctx.beginPath();
			ctx.arc(x, y, 5 , 0, 2 * Math.PI, false);
			ctx.fillStyle = 'black';
			ctx.fill();
			ctx.lineWidth = 5;
			ctx.strokeStyle = '#003300';
			ctx.stroke();
			
		}
	}	
	this.drawCords = function(){
		ctx.fillText( "camera.x:" + this.x + " camera.y:" + this.y,50,100);	
				
	};
}

function map(imageLoc){
	
	this.ready = false;
	this.height;
	this.width;
	this.x = 0;
	this.y = 0;
	
	this.image = new Image();
	this.image.src = imageLoc;
	
	 this.image.onload = (function(map){
		map.ready = true;	
	})(this);
	
	
	this.update = function(){
				
	};
	
	this.draw = function(x,y){	
		if (this.ready) {
			
			if(arguments.length == 0){
				ctx.drawImage(this.image, this.x, this.y);
			}else{
				ctx.drawImage(this.image, x, y);			
			}
		}
	}	
};




// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var gameReady = false;
var init = function () {
	
	if(hero.ready && gameReady == false){

		if(hero.start()){
			
			gameReady = true;
			//monster.startRand();
			//lameHero.startRand();
		}
	}
};

// Update game objects
var update = function (modifier) {
	
	Game.update(modifier);
	
};

// Draw everything
var render = function () {
	
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	ctx.save();
	

	Game.draw();
		
	//debugger;
	
	var ellipse = calculateEllipse( canvas.width/2, canvas.height /2 , canvas.width/3, canvas.height/3, 0, 8);
	
			ctx.beginPath();
			ctx.lineWidth="1";
			ctx.strokeStyle="blue"; // blue path	
													
			for( var h = 0; h < ellipse.length; h++){							
				if( h == 0){
				
					ctx.moveTo( ellipse[h].x, ellipse[h].y );
				
				}else if( h == ellipse.length -1){
					ctx.lineTo( ellipse[h].x, ellipse[h].y);
				
				}else{
					ctx.lineTo( ellipse[h].x, ellipse[h].y);
				}		
			}
			
			ctx.closePath();
			ctx.stroke(); // Draw it
	
	ctx.restore();
		

	
};


/*
* This functions returns an array containing 36 points to draw an
* ellipse.
*
* @param x {double} X coordinate
* @param y {double} Y coordinate
* @param a {double} Semimajor axis
* @param b {double} Semiminor axis
* @param angle {double} Angle of the ellipse
*/


function calculateEllipse(x, y, a, b, angle, steps) 
{
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



// The main game loop
var main = function () {
	
	//setup the game / check assets
	init();
	
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

var pistolWorldProps = {
	x:100,
	y:100,
	image:"images/pistolWorld.png",
	width:32,
	height:32,
	offsetX:0,
	offsetY:0,
	frameY:0,
	frameX:0,
};



//create background
var bgImage = new map( "images/background.png" );

//create Player Object
var hero = new player( heroProps );
var hero2 = new player( hero2Props );


//create weapon objects.
var pistol1handed = new tool(pistol1handedProps);
var pistol2handed = new tool(pistol2handedProps);
var shotgun = new tool(shotGunProps);


var worldPistol = new worldProp( pistolWorldProps );

var following = [hero, hero2];

var camera = new camera(following);

var gameMasterProps = {
	debugging:true,
	camera:camera,
	children:[ bgImage, worldPistol, hero, hero2 ],
};

var Game = new gameMaster( gameMasterProps );


	

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
main();
